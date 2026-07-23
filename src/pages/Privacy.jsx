import LegalPage from '@/components/LegalPage';
import { Link } from 'react-router-dom';
export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" description="How FullyFundedHub collects, uses, and protects your data.">
      <p className="text-muted-foreground">Last updated: July 2026</p>
      <p>At FullyFundedHub, we take your privacy seriously. This policy explains what data we collect, why we collect it, and your rights regarding that data.</p>
      <h2>Data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> When you create an account, we store your name and email address. This is used to identify you and provide access to features like saving opportunities.</li>
        <li><strong>Newsletter sign-ups:</strong> If you subscribe to our newsletter, we store your email address to send you curated opportunity updates.</li>
        <li><strong>Contact form submissions:</strong> When you use our contact form, we store the name, email, and message you provide so our team can respond to your inquiry or review your opportunity submission.</li>
      </ul>
      <h2>How we use your data</h2>
      <ul>
        <li>To create and manage your account.</li>
        <li>To send newsletter emails you've opted into (you can unsubscribe at any time).</li>
        <li>To respond to contact form inquiries and review submitted opportunities.</li>
        <li>To improve our listings and user experience.</li>
      </ul>
      <h2>We do not sell or share your data</h2>
      <p>We <strong>do not sell</strong> your personal data to anyone. We <strong>do not share</strong> your data with third parties for marketing or advertising purposes. Your information is used solely to operate FullyFundedHub and communicate with you about our services.</p>
      <h2>Data retention</h2>
      <p>We retain your account data for as long as your account is active. Newsletter sign-ups and contact form submissions are retained until you request deletion.</p>
      <h2>Requesting data or account deletion</h2>
      <p>You have the right to request deletion of your account and all associated data at any time. To do so, simply <Link to="/contact" className="text-primary hover:underline">contact us</Link> from the email associated with your account and request deletion. We will process your request and remove your data within 30 days.</p>
      <h2>Cookies</h2>
      <p>For information about how we use cookies, please see our <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.</p>
      <h2>Contact</h2>
      <p>If you have any questions about this Privacy Policy, please <Link to="/contact" className="text-primary hover:underline">reach out to us</Link>.</p>
    </LegalPage>
  );
}
