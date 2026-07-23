import LegalPage from '@/components/LegalPage';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <LegalPage title="Cookie Policy" description="How FullyFundedHub uses cookies and similar technologies.">
      <p className="text-muted-foreground">Last updated: July 2026</p>
      <h2>What are cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit a website. They help the site function properly and can improve your browsing experience.</p>
      <h2>How we use cookies</h2>
      <p>FullyFundedHub currently uses cookies for <strong>basic site functionality</strong> — for example, keeping you logged into your account and remembering your preferences.</p>
      <h2>Analytics</h2>
      <p>In the future, we may use cookies for <strong>analytics</strong> to understand how visitors use our site and to improve our content. Any analytics we adopt will be privacy-focused and used only to enhance the platform.</p>
      <h2>No third-party ad tracking</h2>
      <p>We <strong>do not currently use</strong> third-party advertising cookies or tracking pixels. We do not sell your data or share it with advertising networks.</p>
      <h2>Managing cookies</h2>
      <p>You can control and delete cookies through your browser settings. Disabling cookies may affect some site functionality, such as staying logged in.</p>
      <h2>Contact</h2>
      <p>If you have questions about our use of cookies, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.</p>
    </LegalPage>
  );
}
