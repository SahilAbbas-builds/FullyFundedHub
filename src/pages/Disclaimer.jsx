import LegalPage from '@/components/LegalPage';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
  return (
    <LegalPage title="Disclaimer" description="Important information about the accuracy of opportunity listings on FullyFundedHub.">
      <p className="text-muted-foreground">Last updated: July 2026</p>

      <h2>Manual verification — but details may change</h2>
      <p>Every listing on FullyFundedHub is <strong>manually verified</strong> by our team before it is published. We check deadlines, funding amounts, eligibility criteria, and application links to ensure they are accurate at the time of publication.</p>

      <p>However, opportunity details <strong>may change after publication</strong>. Scholarships and internships may be cancelled, deadlines may be extended or moved, funding amounts may be revised, and eligibility criteria may be updated by the providing organization.</p>

      <h2>Always confirm on the official source</h2>
      <p>You must <strong>always confirm current details on the official source link</strong> provided in each listing before applying. FullyFundedHub cannot guarantee that the information displayed remains accurate after the listing was published.</p>

      <h2>No guarantee of outcomes</h2>
      <p>FullyFundedHub provides information only. We do not guarantee that you will be accepted into any opportunity, and we are not involved in selection decisions made by the organizations listed.</p>

      <h2>Reporting inaccuracies</h2>
      <p>If you find information on FullyFundedHub that is outdated or incorrect, please <Link to="/contact" className="text-primary hover:underline">contact us</Link> so we can review and update the listing.</p>
    </LegalPage>
  );
}