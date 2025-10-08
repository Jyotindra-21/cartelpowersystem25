import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
    Container,
    Img,
} from '@react-email/components';

interface PasswordResetEmailProps {
    username: string;
    resetLink: string;
}

export default function PasswordResetEmail({ username, resetLink }: PasswordResetEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Reset Your Password</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Reset your password - this link will expire in 1 hour</Preview>
            
            <Container style={container}>
                {/* Header */}
                <Section style={headerSection}>
                    <Row>
                        <Img 
                            src="https://ik.imagekit.io/cartel/products/image-1753548495967_edpJsiFOr?updatedAt=1753548500805" 
                            alt="Cartel Logo" 
                            style={logo}
                        />
                    </Row>
                    <Row>
                        <Heading as="h1" style={mainTitle}>Reset Your Password</Heading>
                    </Row>
                </Section>

                {/* Content */}
                <Section style={contentSection}>
                    <Row>
                        <Text style={greeting}>
                            Hi {username},
                        </Text>
                    </Row>
                    
                    <Row>
                        <Text style={message}>
                            We received a request to reset your password. Click the button below to create a new password:
                        </Text>
                    </Row>

                    {/* Reset Button */}
                    <Section style={buttonSection}>
                        <Row>
                            <Button href={resetLink} style={button}>
                                Reset Password
                            </Button>
                        </Row>
                    </Section>

                    <Row>
                        <Text style={instructions}>
                            This link will expire in 1 hour for security reasons.
                        </Text>
                    </Row>

                    <Row>
                        <Text style={warning}>
                            If you didn't request this reset, please ignore this email. Your password will remain unchanged.
                        </Text>
                    </Row>

                    {/* Alternative link for email clients that don't support buttons */}
                    <Section style={altLinkSection}>
                        <Row>
                            <Text style={altLinkText}>
                                Or copy and paste this link in your browser:
                            </Text>
                        </Row>
                        <Row>
                            <Text style={linkUrl}>
                                {resetLink}
                            </Text>
                        </Row>
                    </Section>
                </Section>

                {/* Footer */}
                <Section style={footerSection}>
                    <Row>
                        <Text style={footerText}>
                            This is an automated message. Please do not reply to this email.
                        </Text>
                    </Row>
                    <Row>
                        <Text style={copyright}>
                            © 2024 Cartel. All rights reserved.
                        </Text>
                    </Row>
                </Section>
            </Container>
        </Html>
    );
}

// Styles matching your verification email
const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    maxWidth: '500px',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
};

const headerSection = {
    backgroundColor:"#ffffff",
    padding: '20px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #f0f0f0',
};

const logo = {
    height: '40px',
    margin: '0 auto 16px auto',
};

const mainTitle = {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0',
    color: '#000',
};

const contentSection = {
    padding: '24px',
};

const greeting = {
    fontSize: '16px',
    color: '#333333',
    marginBottom: '16px',
};

const message = {
    fontSize: '14px',
    color: '#666666',
    lineHeight: '1.5',
    marginBottom: '24px',
};

const buttonSection = {
    textAlign: 'center' as const,
    margin: '32px 0',
};

const button = {
    backgroundColor: '#2563eb',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 32px',
    margin: '0 auto',
};

const instructions = {
    fontSize: '14px',
    color: '#666666',
    textAlign: 'center' as const,
    marginBottom: '16px',
};

const warning = {
    fontSize: '13px',
    color: '#dc2626',
    textAlign: 'center' as const,
    lineHeight: '1.5',
    marginBottom: '24px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderRadius: '4px',
    border: '1px solid #fecaca',
};

const altLinkSection = {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
};

const altLinkText = {
    fontSize: '13px',
    color: '#475569',
    marginBottom: '8px',
};

const linkUrl = {
    fontSize: '12px',
    color: '#2563eb',
    wordBreak: 'break-all' as const,
    lineHeight: '1.4',
};

const footerSection = {
    padding: '20px',
    textAlign: 'center' as const,
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e9ecef',
};

const footerText = {
    fontSize: '12px',
    color: '#6c757d',
    marginBottom: '8px',
};

const copyright = {
    fontSize: '12px',
    color: '#6c757d',
    margin: '0',
};