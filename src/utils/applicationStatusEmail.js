import {resend} from "@/lib/resend"
import ApplicationStatusEmail from "../../emails/projectApplicationStatus"

export const sendEmail = async (freelancerEmail, appStatus, freelancer, client,  project) => {
    try {
      console.log(freelancerEmail, appStatus, freelancer, client,  project, "From mail utilis function");
        const { data, error } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: freelancerEmail,
          subject: 'Information regarding application Status of the project',
          react: <ApplicationStatusEmail appStatus={appStatus} freelancer={freelancer} client={client} project={project} />
        });
    
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), { status: 404 });
        }
        
        return new Response(JSON.stringify(data));
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
}


    
    
