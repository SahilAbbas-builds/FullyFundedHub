DKIM

Type   TXT	
Name: resend._domainkey       Content:p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCh9IHeUAtj/2Dt+aqVDdFhmLqJGapLI9MGbwCMN0zlq7uxOxrC2hp751qAC2eOLe7/zrv9vXNEk3wWCszZ9h4vLRMwKK7m1LQU7z6ccoZycNbskJToe7jnwcI0wSTidPwLoxUH+Q6NNOtgGNkGhvIGmCdhF0txbOqJsxjcN7H2dwIDAQAB
TTL:Auto


SPF
Name:send     content:feedback-smtp.us-east-1.amazonses.com

Name:send      content:v=spf1 include:amazonses.com ~all


DMARC
(Optional)

Name:_dmarc       Content:v=DMARC1; p=none;