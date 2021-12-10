import React, { useEffect } from 'react'
import { Scrollbars } from 'react-custom-scrollbars';
import { useHistory } from 'react-router';
import { restrictBack } from '../commonFunctions';

const TermPolicy = () => {
    const history = useHistory()
    useEffect(() => {
        restrictBack()
    }, [])
    return (

        <div class="terms_conditions">
            <a href="javascript:void(0)" className="btn-back  mb-4" onClick={() => history.push("/login")} ><i className="fas fa-chevron-left" /></a>
            <h1>GlittersTerms &amp; Conditions</h1>

            <p><strong>THE AGREEMENT</strong> : The use of this Application, the Website and the services of this Application and the website provided by Exemplary Application Developers (hereinafter &quot;Company&quot;) are subject to the following Terms and Conditions (hereinafter, the &quot;Agreement&quot;), all parts and subparts of which are specifically incorporated herein by reference. This Agreement will govern the use of all pages of this Application and the Website (hereinafter collectively referred to as &quot;Application&quot;) and any services provided by or on this Application and the Website (&quot;Services&quot;).</p>
            <strong>ABOUT:</strong>
            <ol class="list-section">
                <li> <strong>DEFINITIONS </strong> The parties referred to in this Agreement shall be defined as follows :
                    <ol type="a">
                        <li>Company, Us, We: The Company, as creator, operator and publisher of the Application and the Website, makes the Application and the Website and some of its Services available to users. Exemplary App Developers, Company, We, Our, Our, and other first-person pronouns will refer to the Company, as well as all employees and affiliates of the Company</li>
                        <li >You, the User, the Client: You, as a user of the Application and of the website, will be referred to throughout this Agreement with second-person pronouns as You, His, His, His or as User or Client.</li>
                        <li >Parties: Collectively, the parties to this Agreement (the Company and You) will be referred to as Parties.</li>
                    </ol>
                </li>

                <li><strong>ASSENT &amp; ACCEPTANCE</strong> By using the App, you warrant that You have read and reviewed this Agreement and that You agree to be bound by it. If You do not agree to be bound by this Agreement, please leave the App immediately. The Company only agrees to provide use of this App and Services to You if You assent to this Agreement.</li>

                <li><strong>CONTENT OF THE PLATFORM</strong> The company requires that you be aware of the type of content that you will be exposed to when accessing and using Glitters services. This content includes exposure and visualization of nudity, genitalia, explicit sexual acts where there may be masturbation, fellatio, penetration between 1 or more people of the same or different gender as long as they are over 18 years of age, through the various services offered by the company, ranging from stories, videos, photos, live streaming, video calls, voice calls, random calls, chat, among others. If you enter the Glitters platform, you affirm that you have read and agree with what is described in this article. If you do not agree with the content that you will view and to which it will be exposed on the Glitters platform, leave the platform and do not use the services offered by the company.</li>

                <li><strong>
                    PLATFORM RESTRICTIONS YOU UNDERSTAND AND HEREBY ACKNOWLEDGE, RESPECT AND ACCEPT OUR RESTRICTIONS AS A PLATFORM, WHICH ARE INDICATED BELOW:
                </strong>
                    <ol type="a">
                        <li >You must be at least 18 (eighteen) years of age to use this Application or any Service contained in this document. By using this application, you represent and warrant that you are at least 18 years of age and that you can legally accept this Agreement. The Company assumes no responsibility for any misrepresentation of your age. The company has the right to suspend and delete your account if it considers you are violating this clause. </li>
                        <li >The company disapproves and prohibits child pornography, which includes: displaying, broadcasting or reproducing images, videos, any material or transmission in real time in which a minor (person under 18 years of age) is found; perform or simulate an erotic or sexual act.Role play that pretends to be minors and simulate or perform any erotic and sexual act is prohibited. The company has the right to suspend, delete, report your account and collaborate with the relevant authorities, providing any data or information that you have provided us. If you have an interest in child pornography, please leave our platform immediately and do not use any Glitters services. </li>
                        <li >The company disapproves and prohibits zoophilia, which includes: showing, broadcasting or reproducing images, videos, any material or transmission in real time of any animal or person being used to perform or simulate explicit sexual acts where there may be masturbation, fellatio, penetration with animals. The company has the right to suspend, delete, report your account and collaborate with the relevant authorities, providing any data or information that you have provided us. If you are interested in acts of zoophilia, please leave our platform immediately and do not use any Glitters services. </li>
                        <li > The company disapproves and prohibits people with mental or motor disabilities from being used by third parties in order to simulate or perform erotic or sexual acts such as fellatio, penetration, masturbation, among others. The company has the right to suspend, delete, report your account and collaborate with the relevant authorities, providing any data or information that you have providedus.</li>
                    </ol>
                </li>

                <li ><strong>LICENSE TO USE APP</strong> The Company may provide You with certain information as a result of Your use of the App or Services. Such information may include, but is not limited to, documentation, data, or information developed by the Company, and other materials which may assist in Your use of the App or Services (&quot;Company Materials&quot;). Subject to this Agreement, the Company grants You a non-exclusive, limited, non-transferable and revocable license to use the Company Materials solely in connection with Your use of the App and Services. The Company Materials may not be used for any other purpose, and this license terminates upon Your cessation of use of the App or Services or at the termination of this Agreement.</li>

                <li><strong>INTELLECTUAL PROPERTY</strong> You agree that the App and all Services provided by the Company are the property of the Company, including all copyrights, trademarks, trade secrets, patents, and other intellectual property (&quot;Company IP&quot;). You agree that the Company owns all right, title and interest in and to the Company IP and that You will not use the Company IP for any unlawful or infringing purpose. You agree not to reproduce or distribute the Company IP in any way, including electronically or via registration of any new trademarks, trade names, service marks or Uniform Resource Locators (URLs), without express written permission from the Company.
                    <ol type="a"> <li >In order to make the App and Services available to You, You hereby grant the Company a royalty-free, non-exclusive, worldwide license to copy, display, use, broadcast, transmit and make derivative works of any content You publish, upload, or otherwise make available to the App (&quot;Your Content&quot;). The Company claims no further proprietary rights in Your Content. </li>
                        <li >If You feel that any of Your intellectual property rights have been infringed or otherwise violated by the posting of information or media by another of Our users, please contact Us and let Us know.</li>
                    </ol>
                </li>

                <li ><strong>USER OBLIGATIONS</strong> Your Account Registration. If You create an account on any of the Glitters Services (a &ldquo;User Account&rdquo;) and submit information to Us, you must ensure that such information is accurate. You must promptly update such information if it changes. Accounts are for Your Use Only. You may not use anyone else&rsquo;s account at any time. You may not buy, sell, rent, or lease access to Your User Account or Your username without Our written permission. You will not share or otherwise transfer Your User Account or credentials. Security of Your Account. You are entirely responsible for maintaining the confidentiality of Your password and account. You are entirely responsible for any and all activities that occur under Your account. You agree to notify Glitters immediately of any unauthorized use of Your account or any other breach of security. We will not be liable for any loss, damages, liability, expenses or attorneys&rsquo; fees that You may incur as a result of someone else using Your password or account, either with or without Your knowledge. We Have No Obligation to Retain a Record of Your Account. Glitters has no obligation to retain a record of Your account or any data or information that You may have stored for Your convenience by means of Your account or the Glitters Services. The Glitters Services are not intended for data storage. You are solely responsible for backing up your data (e.g., separately saving the contact information of individuals you meet through the Glitters Services).
                </li>

                <li >
                    <strong>ACCEPTABLE USE YOU UNDERSTAND AND HEREBY ACKNOWLEDGE AND AGREE TO THE FOLLOWING TERMS REGARDING PROHIBITED CONDUCT AND USES LISTED BELOW:</strong>
                    <ol type="a">
                        <li >You will NOT use the Glitters Services or any information displayed within the Glitters Services to &ldquo;stalk,&rdquo; harass, abuse, defame, threaten or defraud other Users; violate the privacy or other rights of Users; or collect, attempt to collect, store, or disclose without permission the location or personal information about other Users;</li>
                        <li >You will NOT include content that is offensive or illegal, related to child pornography, zoophiliaor any content that is harmful or illegal on the personal profile page of your Glitters profile; </li>
                        <li >You will NOT use the Glitters Services for any commercial or non-private use, such as the sale or advertisement of goods or services, and You will use the Glitters Services for personal, non-commercial use only in the manner and for the purposes that We intend;</li>
                        <li > You will NOT use the Glitters Services for the commission or encouragement of any illegal purpose, or in violation of any local, state, national, or international law, including laws governing criminal acts, prohibited or controlled substances, intellectual property and other proprietary rights, data protection and privacy, and import or export control; </li>
                        <li > You will NOT include material on Your personal profile page which contains video, audio, photographs, or images of any person under the age of eighteen (18) at all or any person over the age of eighteen (18) without his or her express permission; </li>
                        <li > You will NOT make unsolicited offers, advertisements, proposals, or send junk mail to other Users of the Glitters Services. This includes unsolicited advertising, promotional materials or other solicitation material, bulk mailing of commercial advertising, chain mail, informational announcements, charity requests, and petitions for signatures, surveying or requests to participate in surveys or studies; </li>
                        <li >You will NOT impersonate any person or entity, falsely claim an affiliation with any person or entity, or access the Glitters User Accounts of other Users;</li>
                        <li> You will NOT misrepresent the source, identity or content of information transmitted via the Glitters Services; </li>
                        <li > You will NOT display the Glitters application or profile data on any external display or monitor or in any public setting; </li>
                        <li > You will NOT remove, circumvent, disable, damage or otherwise interfere with security-related features of the Glitters Services, features that prevent or restrict use or copying of any content accessible through the Glitters Services, or features that enforce limitations on use of the Glitters Services; </li>
                        k) You will NOT intentionally interfere with or damage operation of the Glitters Services or any User&rsquo;s enjoyment of them, by any means, including uploading or otherwise disseminating viruses, worms, or other malicious code;
                        <li > You will NOT post, store, send, transmit, or disseminate any information or material which a reasonable person could deem to be objectionable, defamatory, libelous, offensive, obscene, indecent, pornographic, harassing, threatening, embarrassing, distressing, vulgar, hateful, racially or ethnically or otherwise offensive to any group or individual, intentionally misleading, false, or otherwise inappropriate, regardless of whether this material or its dissemination is unlawful;</li>
                        <li > You will NOT post, store, send, transmit, or disseminate any information or material which infringes any patents, trademarks, trade secrets, copyrights, or any other rights of any person;</li>
                        <li >You will NOT use the Glitters Services with any products, systems, or applications installed or otherwise connected to or in communication with vehicles, or otherwise capable of vehicle navigation, positioning, dispatch, real time route guidance, fleet management, or similar applications; </li>
                        <li> You will NOT use the Glitters Services in connection with hazardous environments requiring fail-safe performance or any application in which the failure or inaccuracy of that application or the Glitters Services could lead to death, personal injury, or physical or property damage;
                        </li>
                        <li > You will NOT attempt to gain unauthorized access to the Glitters Services, or any part of it, other accounts, computer systems or networks connected to the Glitters Services, or any part of it, through hacking, password mining or any other means, or interfere or attempt to interfere with the proper working of the Glitters Services or any activities conducted on the Glitters Service; </li>
                        <li > You will NOT probe, scan, or test the vulnerability of the Glitters Services or any system or network; use any robot, spider, scraper or other automated means to access the Glitters Services for any purpose without Our express written permission; bypass Our robot exclusion headers or other measures that We may use to prevent or restrict access to the Glitters Services; modify the Glitters Services in any manner or form; use or develop any application or other product that interacts with the Glitters Services or provides access to other Users&rsquo; content or information without Our written permission; or use modified versions of the Glitters Services, including for the purpose of obtaining unauthorized access to the Glitters Services; and </li>
                        <li > You will NOT interfere with anyone&rsquo;s ability to use or enjoy the Glitters Service, or aid or encourage any activity prohibited by this Agreement.</li>
                    </ol>
                </li>


                <li> <strong>USER CONTENT</strong> The Glitters Services allow the submission of content and materials (such as pictures, ideas, notes, concepts, or creative suggestions) by You and other Users to Glitters and other Users (&ldquo;User Content&rdquo;), and the hosting, sharing and/or publishing of such User Content with Glitters and other Users. You are solely responsible for Your own User Content and the consequences of posting or publishing them. In connection with User Content, You represent and warrant that:

                    <ol type="i">
                        <li >You own, or have the necessary licenses, rights, consents, and permissions to use, and authorize Glitters to use, all intellectual property and any other proprietary rights in and to any and all User Content to enable inclusion and use of the User Content in the manner contemplated by the Glitters Services and this Agreement; and </li>
                        <li >
                            You have the written consent, release, and/or permission of each and every identifiable individual person in the User Content to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of the User Content in the manner contemplated by the Glitters Services and this Agreement. For clarity, You shall retain all of Your ownership rights in Your User Content. You understand that when using the Glitters Services, You will be exposed to User Content from a variety of sources, and that Glitters is not responsible for the accuracy, usefulness, safety, or intellectual property rights of or relating to such User Content. You further understand and acknowledge that You may be exposed to User Content that is inaccurate, offensive, indecent or objectionable. Glitters assumes no responsibility whatsoever in connection with or arising from User Content. Glitters assumes no responsibility for actively monitoring User Content for inappropriate content. If at any time Glitters chooses, in its sole discretion, to monitor User Content, Glitters nonetheless assumes no responsibility for the content of the User Content, no obligation to modify or remove any inappropriate User Content, and no responsibility for the conduct of the User submitting User Content. Further, Glitters does not endorse and has no control over the content of User Content submitted by other Users. Glitters makes no warranties, express or implied, as to the content of User Content or the accuracy and reliability of any User Content. Nonetheless, Glitters reserves the right to prevent You from submitting User Content and to edit, restrict or remove User Content for any reason at any time. User Content is owned by the User who submitted it, subject to Glitters&rsquo;s license to such User Content under this Agreement. You may not share, display or duplicate the User Content of any other party, except as permitted under this Agreement. You hereby grant, and You represent and warrant that You have the right to grant, to Glitters an irrevocable, nonexclusive, royalty-free and fully paid worldwide license to reproduce, distribute, publicly display and perform, prepare derivative works of, incorporate into other works, and otherwise use and exploit Your User Content, (through unlimited tiers of sublicenses), solely for the purposes of including Your User Content in the Glitters Services and as otherwise permitted by this Agreement. You agree to irrevocably waive (and cause to be waived) any claims and assertions of moral rights or attribution with respect to Your User Content. You also hereby grant to Glitters, in connection with a sale of Glitters or the assets of Glitters, the right to sell or transfer the User Content to a third party. Please see Our Privacy Policy for additional information about the use, collection, or sharing of Your information, including User Content. If You provide Glitters with any feedback or suggestions regarding the Glitters Services (&ldquo;Feedback&rdquo;), You hereby grant Glitters the perpetual, irrevocable, worldwide license (with the right to sublicense) to use such Feedback and related information in any manner it deems appropriate. Glitters will treat any Feedback You provide to Glitters as non-confidential and non-proprietary to You. Glitters will have no obligation under any circumstances to compensate You for any Feedback. You agree that You will not submit to Glitters any information or ideas that You consider to be confidential or proprietary, or for which You expect to be compensated.
                        </li>
                    </ol>
                </li>

                <li ><strong>PRIVACY INFORMATION</strong> Through Your Use of the App and Services, You may provide Us with certain information. By using the App or the Services, You authorize the Company to use Your information in the United States and any other country where We may operate. a) Information We May Collect or Receive: When You register for an account, You provide Us with a valid email address and may provide Us with additional information, such as Your name or billing information. Depending on how You use Our App or Services, We may also receive information from external applications that You use to access Our App, or We may receive information through various web technologies, such as cookies, log files, clear gifs, web beacons or others. b) How We Use Information: We use the information gathered from You to ensure Your continued good experience on Our App, including through email communication. We may also track certain aspects of the passive information received to improve Our marketing and analytics, and for this, We may work with third-party providers. c) How You Can Protect Your Information: If You would like to disable Our access to any passive information We receive from the use of various technologies, You may choose to disable cookies in Your web browser. Please be aware that the Company will still receive information about You that You have provided, such as Your email address. If you choose to cancel your account, the Company removes your information from our system immediately.</li>

                <li ><strong>SALES</strong> The Company may sell goods or services or allow third parties to sell goods or services on the App. The Company undertakes to be as accurate as possible with all information regarding the goods and services, including product descriptions and images. However, the Company does not guarantee the accuracy or reliability of any product information, and You acknowledge and agree that You purchase such products at Your own risk.</li>

                <li > <strong>REVERSE ENGINEERING &amp; SECURITY</strong> You agree not to undertake any of the following actions: a) Reverse engineer, or attempt to reverse engineer or disassemble any code or software from or on the App or Services; b) Violate the security of the App or Services through any unauthorized access, circumvention of encryption or other security tools, data mining or interference to any host, user or network.</li>

                <li ><strong>DATA LOSS</strong> The Company does not accept responsibility for the security of Your account or content. You agree that Your use of the App or Services is at Your own risk.</li>

                <li > <strong>INDEMNIFICATION</strong> You agree to defend and indemnify the Company and any of its affiliates (if applicable) and hold Us harmless against any and all legal claims and demands, including reasonable attorney's fees, which may arise from or relate to Your use or misuse of the App or Services, Your breach of this Agreement, or Your conduct or actions. You agree that the Company shall be able to select its own legal counsel and may participate in its own defense, if the Company wishes.</li>

                <li ><strong>SPAM POLICY</strong> You are strictly prohibited from using the App or any of the Company's Services for illegal spam activities, including gathering email addresses and personal information from others or sending any mass commercial emails.</li>

                <li> <strong>THIRD-PARTY LINKS &amp; CONTENT</strong> The Company may occasionally post links to third party Apps or other services. You agree that the Company is not responsible or liable for any loss or damage caused as a result of Your use of any third party services linked to from Our App.</li>

                <li> <strong> MODIFICATION &amp; VARIATION</strong> The Company may, from time to time and at any time without notice to You, modify this Agreement. You agree that the Company has the right to modify this Agreement or revise anything contained herein. You further agree that all modifications to this Agreement are in full force and effect immediately upon posting on the App and that modifications or variations will replace any prior version of this Agreement, unless prior versions are specifically referred to or incorporated into the latest modification or variation of this Agreement.
                    <ol type="a">
                        <li > To the extent any part or sub-part of this Agreement is held ineffective or invalid by any court of law, You agree that the prior, effective version of this Agreement shall be considered enforceable and valid to the fullest extent. </li>
                        <li > You agree to routinely monitor this Agreement and refer to the Effective Date posted at the top of this Agreement to note modifications or variations. You further agree to clear Your cache when doing so to avoid accessing a prior version of this Agreement. You agree that Your continued use of the App after any modifications to this Agreement is a manifestation of Your continued assent to this Agreement. </li>
                        <li > In the event that You fail to monitor any modifications to or variations of this Agreement, You agree that such failure shall be considered an affirmative waiver of Your right to review the modified Agreement.</li>
                    </ol>
                </li>

                <li > <strong>ENTIRE AGREEMENT</strong> This Agreement constitutes the entire understanding between the Parties with respect to any and all use of this App. This Agreement supersedes and replaces all prior or contemporaneous agreements or understandings, written or oral, regarding the use of this App.</li>

                <li ><strong>SERVICE INTERRUPTIONS</strong> The Company may need to interrupt Your access to the App to perform maintenance or emergency services on a scheduled or unscheduled basis. You agree that Your access to the App may be affected by unanticipated or unscheduled downtime, for any reason, but that the Company shall have no liability for any damage or loss caused as a result of such downtime.</li>

                <li ><strong>TERM, TERMINATION &amp; SUSPENSION</strong> The Company may terminate this Agreement with You at any time for any reason, with or without cause. The Company specifically reserves the right to terminate this Agreement if You violate any of the terms outlined herein, including, but not limited to, violating the intellectual property rights of the Company or a third party, failing to comply with applicable laws or other legal obligations, and/or publishing or distributing illegal material. If You have registered for an account with Us, You may also terminate this Agreement at any time by contacting Us and requesting termination. At the termination of this Agreement, any provisions that would be expected to survive termination by their nature shall remain in full force and effect.</li>

                <li > <strong>NO WARRANTIES</strong> You agree that Your use of the App and Services is at Your sole and exclusive risk and that any Services provided by Us are on an &quot;As Is&quot; basis. The Company hereby expressly disclaims any and all express or implied warranties of any kind, including, but not limited to the implied warranty of fitness for a particular purpose and the implied warranty of merchantability. The Company makes no warranties that the App or Services will meet Your needs or that the App or Services will be uninterrupted, error-free, or secure. The Company also makes no warranties as to the reliability or accuracy of any information on the App or obtained through the Services. You agree that any damage that may occur to You, through Your computer system, or as a result of loss of Your data from Your use of the App or Services is Your sole responsibility and that the Company is not liable for any such damage or loss.</li>

                <li ><strong>LIMITATION ON LIABILITY</strong> The Company is not liable for any damages that may occur to You as a result of Your use of the App or Services, to the fullest extent permitted by law. The maximum liability of the Company arising from or relating to this Agreement is limited to the greater of one hundred ($100) US Dollars or the amount You paid to the Company in the last six (6) months. This section applies to any and all claims by You, including, but not limited to, lost profits or revenues, consequential or punitive damages, negligence, strict liability, fraud, or torts of any kind.</li>

                <li> <strong>GENERAL PROVISIONS: </strong>
                    <ol type="a">
                        <li > <b>LANGUAGE: </b> All communications made or notices given pursuant to this Agreement shall be in the English language.</li>
                        <li ><b>JURISDICTION, VENUE &amp; CHOICE OF LAW: </b> Through Your use of the App or Services, You agree that the laws of the United States shall govern any matter or dispute relating to or arising out of this Agreement, as well as any dispute of any kind that may arise between You and the Company, with the exception of its conflict of law provisions.In case any litigation specifically permitted under this Agreement is initiated, the Parties agree to submit to the personal jurisdiction of the state and federal courts of the United States.The Parties agree that this choice of law, venue, and jurisdiction provision is not permissive, but rather mandatory in nature.You hereby waive the right to any objection of venue, including assertion of the doctrine of forum non conveniens or similar doctrine.</li>
                        <li ><b>ASSIGNMENT: </b> This Agreement, or the rights granted hereunder, may not be assigned, sold, leased or otherwise transferred in whole or part by You.Should this Agreement, or the rights granted hereunder, by assigned, sold, leased or otherwise transferred by the Company, the rights and liabilities of the Company will bind and inure to any assignees, administrators, successors, and executors.</li>
                        <li > <b>SEVERABILITY: </b> If any part or sub-part of this Agreement is held invalid or unenforceable by a court of law or competent arbitrator, the remaining parts and sub-parts will be enforced to the maximum extent possible.In such condition, the remainder of this Agreement shall continue in full force.</li>
                        <li > <b>NO WAIVER: </b> In the event that We fail to enforce any provision of this Agreement, this shall not constitute a waiver of any future enforcement of that provision or of any other provision.Waiver of any part or sub-part of this Agreement will not constitute a waiver of any other part or sub-part.</li>

                        <li > <b>HEADINGS FOR CONVENIENCE ONLY: </b> Headings of parts and sub-parts under this Agreement are for convenience and organization, only.Headings shall not affect the meaning of any provisions of this Agreement.</li>

                        <li > <b>NO AGENCY, PARTNERSHIP OR JOINT VENTURE: </b> No agency, partnership, or joint venture has been created between the Parties as a result of this Agreement.No Party has any authority to bind the other to third parties.</li>
                        <li ><b>FORCE MAJEURE: </b> The Company is not liable for any failure to perform due to causes beyond its reasonable control including, but not limited to, acts of God, acts of civil authorities, acts of military authorities, riots, embargoes, acts of nature and natural disasters, and other acts which may be due to unforeseen circumstances.</li>

                        <li> <b>ELECTRONIC COMMUNICATIONS PERMITTED: </b> Electronic communications are permitted to both Parties under this Agreement, including e-mail or fax.For any questions or concerns, please email Us at the following address: <a href="mailto:customer.support@clickmystar.in">customer.support @clickmystar.in</a>.</li>
                    </ol>
                </li>
            </ol>
        </div>
    )
}
export default TermPolicy