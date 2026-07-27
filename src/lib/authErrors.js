export function getAuthErrorMessage(error) {
  const msg = error?.message || '';
  const lower = msg.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Incorrect email or password. Double-check both and try again.';
  }
  if (lower.includes('email not confirmed')) {
    return "Please confirm your email first — check your inbox for the verification link we sent you.";
  }
  if (lower.includes('user already registered') || lower.includes('already registered')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (lower.includes('password') && lower.includes('6 characters')) {
    return 'Your password needs to be at least 6 characters long.';
  }
  if (lower.includes('invalid') && lower.includes('email')) {
    return "That doesn't look like a valid email address. Please check and try again.";
  }
  if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('for security purposes')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Connection issue — please check your internet and try again.';
  }
  return msg || 'Something went wrong. Please try again.';
}

export function isUnverifiedEmailError(error) {
  const msg = (error?.message || '').toLowerCase();
  return msg.includes('email not confirmed');
}

export function isRateLimitError(error) {
  const msg = (error?.message || '').toLowerCase();
  return msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('for security purposes');
}
