import LegalPage from '@/components/LegalPage';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <LegalPage title="Terms & Conditions" description="The terms governing your use of FullyFundedHub.">
      <p className="text-muted-foreground">Last updated: July 2026</p>

      <p>By accessing and using FullyFundedHub, you agree to the following terms and conditions.</p>

      <h2>Informational listings only</h2>
      <p>FullyFundedHub is a <strong>directory and information platform</strong>. We publish curated listings of scholarships and internships to help students discover opportunities. All content on this site is provided for informational purposes only.</p>

      <h2>No affiliation with providers</h2>
      <p>FullyFundedHub is <strong>not affiliated with</strong>, endorsed by, or connected to any of the scholarship or internship providers listed on this site. We do not represent any of these organizations, and we are not involved in their selection processes.</p>

      <h2>Not responsible for application outcomes</h2>
      <p>We are <strong>not responsible</strong> for the outcomes of any application you submit through a link on our site. Decisions about admissions, funding, and selection are made solely by the organizations offering the opportunity. We make no guarantees regarding acceptance, funding amounts, or eligibility.</p>

      <h2>Accuracy of information</h2>
      <p>While we manually verify every listing before publishing, opportunity details may change after publication. You must always confirm current details on the official source link provided before applying. See our <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> for more information.</p>

      <h2>User accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials. You agree not to use FullyFundedHub for any unlawful purpose or in a way that could harm the platform.</p>

      <h2>External links</h2>
      <p>Our site contains links to external websites (application portals, official opportunity pages). We are not responsible for the content, privacy practices, or accuracy of these external sites.</p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms from time to time. Continued use of FullyFundedHub after changes constitutes acceptance of the updated terms.</p>

      <h2>Contact</h2>
      <p>If you have questions about these Terms & Conditions, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.</p>
    </LegalPage>
  );
}
