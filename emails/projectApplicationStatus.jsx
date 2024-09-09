import * as React from 'react';
import { Html, Button, Text, Container, Section, Heading, Preview } from '@react-email/components';

function ApplicationStatusEmail({ appStatus, freelancer, client, project }) {
//  console.log(appStatus, freelancer,client, project, "From Mail Template");
  
  const isAccepted = (appStatus === 'accepted');
  console.log(isAccepted);
  const emailMessage = isAccepted
    ? `Congratulations ${freelancer}, your application has been accepted by ${client} for the project: ${project}.`
    : `Sorry ${freelancer}, your application has been rejected by ${client} for the project: ${project}.`;

  return (
    <Html lang="en">
      {/* Preview text that appears in the email client's inbox preview */}
      <Preview>
        {isAccepted
          ? `Congrats ${freelancer}! Your application was accepted for ${project}`
          : `Sorry ${freelancer}, your application was rejected for ${project}`}
      </Preview>

      <Container>
        <Section style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
          <Heading style={{ fontSize: '24px', color: '#333' }}>
            {isAccepted ? 'Application Accepted!' : 'Application Rejected'}
          </Heading>

          <Text style={{ fontSize: '16px', margin: '10px 0', color: '#555' }}>
            {emailMessage}
          </Text>

          {/* Commented out the button for viewing project details */}
          {/* 
          {isAccepted && (
            <Button
              href="/dashboard"
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                textDecoration: 'none',
                borderRadius: '5px',
              }}
            >
              View Project Details
            </Button>
          )}
          */}

          {!isAccepted && (
            <Text style={{ fontSize: '14px', color: '#999' }}>
              Feel free to explore other opportunities on our platform.
            </Text>
          )}
        </Section>
      </Container>
    </Html>
  );
}

export default ApplicationStatusEmail;
