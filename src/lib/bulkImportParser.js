// Parses bulk-pasted opportunity text into objects matching the
// `opportunities` table schema. A new entry is detected either at a
// line containing only "---", OR automatically whenever a non-label
// line (a title) is immediately followed by a label line like
// "Country: ..." — this works regardless of exact blank-line spacing.
// Extra fields with no dedicated column are folded into `description`
// so no pasted data is lost.

const LABEL_PATTERN = /^([A-Za-z][A-Za-z /'\-()]{1,60}):\s*(.*)$/;

const COUNTRY_CODES = {
  'united states': 'US', usa: 'US', 'united kingdom': 'GB', uk: 'GB',
  germany: 'DE', france: 'FR', switzerland: 'CH', japan: 'JP',
  china: 'CN', australia: 'AU', canada: 'CA', 'new zealand': 'NZ',
  netherlands: 'NL', ireland: 'IE', turkey: 'TR', 'south korea': 'KR',
  india: 'IN', italy: 'IT', spain: 'ES', sweden: 'SE', norway: 'NO',
  denmark: 'DK', finland: 'FI', belgium: 'BE', austria: 'AT',
  singapore: 'SG', 'south africa': 'ZA', hungary: 'HU', romania: 'RO',
  taiwan: 'TW', qatar: 'QA', 'saudi arabia': 'SA',
};

const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];

function isLabelLine(line) {
  return LABEL_PATTERN.test(line.trim());
}

function normalizeKey(label) {
  return label.trim().toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, ' ');
}

function parseDate(raw) {
  if (!raw) return '';
  const cleaned = raw.trim();
  const m = cleaned.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (m) {
    const day = parseInt(m[1], 10);
    const monthIdx = MONTHS.indexOf(m[2].toLowerCase());
    const year = parseInt(m[3], 10);
    if (monthIdx !== -1) {
      return `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(cleaned)) return cleaned.slice(0, 10);
  return '';
}

function guessCountryCode(country) {
  if (!country) return '';
  const key = country.toLowerCase().replace(/\(.*?\)/g, '').trim();
  for (const name in COUNTRY_CODES) {
    if (key.includes(name)) return COUNTRY_CODES[name];
  }
  return '';
}

function guessDegreeLevel(raw) {
  const v = (raw || '').toLowerCase();
  if (v.includes('bachelor') || v.includes('undergraduate')) return 'Undergraduate';
  if (v.includes('master')) return 'Masters';
  if (v.includes('phd') || v.includes('doctorate') || v.includes('doctoral')) return 'PhD';
  return 'All Levels';
}

const MAPPED_KEYS = new Set([
  'organization', 'universityorganization', 'university',
  'country', 'application deadline', 'deadline',
  'eligibility criteria', 'available fields', 'available fields of study', 'field of study',
  'official application link', 'application url', 'application link',
  'official scholarship page', 'official program page',
  'seo-friendly summary', 'short seo-friendly summary',
  'degree level',
]);

function parseBlock(rawBlock, index) {
  const lines = rawBlock.replace(/\r\n/g, '\n').split('\n');

  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  let title = (lines[i] || `Untitled opportunity ${index + 1}`).trim();
  title = title.replace(/^\d+[.)]\s*/, '');
  i++;

  const fields = [];
  let current = null;

  for (; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(LABEL_PATTERN);
    if (match) {
      current = { key: normalizeKey(match[1]), label: match[1].trim(), value: match[2].trim() };
      fields.push(current);
    } else if (current && line.trim()) {
      current.value = (current.value ? current.value + ' ' : '') + line.trim();
    }
  }

  const get = (...keys) => {
    for (const k of keys) {
      const f = fields.find((f) => f.key === k);
      if (f && f.value) return f.value;
    }
    return '';
  };

  const organization = get('organization', 'universityorganization', 'university');
  const country = get('country');
  const deadlineRawText = get('application deadline', 'deadline');
  const deadline = parseDate(deadlineRawText);
  const fieldOfStudy = get('available fields', 'available fields of study', 'field of study');
  let applicationUrl = get('official application link', 'application url', 'application link');
  const scholarshipPage = get('official scholarship page', 'official program page');
  if ((!applicationUrl || /not officially specified/i.test(applicationUrl)) && scholarshipPage) {
    applicationUrl = scholarshipPage;
  }
  const eligibilityRaw = get('eligibility criteria');
  const whoCanApply = get('who can apply');
  const seoSummary = get('seo-friendly summary', 'short seo-friendly summary');
  const degreeLevelRaw = get('degree level');

  const isInternship = /internship/i.test(title) || /internship/i.test(get('internship type'));
  const fundingType = (get('funding type') || '').toLowerCase().includes('partial') ? 'Partial' : 'Full';
  const monthlyStipend = get('monthly stipend');

  const eligibility = eligibilityRaw
    ? eligibilityRaw.split(/\.\s+(?=[A-Z])/).map((s) => s.trim().replace(/\.$/, '')).filter(Boolean).map((s) => s + '.')
    : [];
  if (whoCanApply) eligibility.push(`Who can apply: ${whoCanApply}`);

  const extras = fields.filter((f) => !MAPPED_KEYS.has(f.key) && f.key !== 'who can apply' && f.value);
  const extraText = extras.map((f) => `${f.label}: ${f.value}`).join('\n');
  const description = [seoSummary, extraText].filter(Boolean).join('\n\n');

  return {
    title, organization, country,
    country_code: guessCountryCode(country),
    opportunity_type: isInternship ? 'Internship' : 'Scholarship',
    degree_level: guessDegreeLevel(degreeLevelRaw),
    field_of_study: fieldOfStudy,
    funding_type: fundingType,
    funding_amount: monthlyStipend,
    deadline,
    application_url: applicationUrl,
    eligibility_criteria: eligibility,
    raw_notes: rawBlock.trim(),
    description,
    is_featured: false,
    status: 'draft',
  };
}

function splitIntoBlocks(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let current = [];
  let sawFieldInCurrent = false;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    if (!trimmed) {
      current.push(line);
      continue;
    }

    if (!isLabelLine(line)) {
      let j = idx + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      const nextIsLabel = j < lines.length && isLabelLine(lines[j]);
      if (nextIsLabel && sawFieldInCurrent) {
        blocks.push(current.join('\n'));
        current = [line];
        sawFieldInCurrent = false;
        continue;
      }
    } else {
      sawFieldInCurrent = true;
    }
    current.push(line);
  }
  if (current.some((l) => l.trim())) blocks.push(current.join('\n'));
  return blocks.map((b) => b.trim()).filter(Boolean);
}

export function parseBulkText(text) {
  const cleaned = text.replace(/\r\n/g, '\n').trim();
  if (!cleaned) return [];

  const blocks = /^-{3,}\s*$/m.test(cleaned)
    ? cleaned.split(/^-{3,}\s*$/m).map((b) => b.trim()).filter(Boolean)
    : splitIntoBlocks(cleaned);

  return blocks.map((block, idx) => parseBlock(block, idx));
}


