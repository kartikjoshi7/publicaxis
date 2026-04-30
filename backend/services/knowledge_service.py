"""
PublicAxis Backend — Civic Knowledge Base Service
Curated Election Commission knowledge corpus with step-by-step voter registration
timelines, election day schedules, and general election process phases.
In production, this would be replaced by a vector database (RAG) for scalable retrieval.
"""


def get_election_context(query: str) -> str:
    """
    Mock RAG knowledge base returning hardcoded Indian election rules.
    In a production system, this would embed the query and search a vector database.
    """
    context = """
    Essential Indian Election Commission Rules & Information:
    
    === STEP-BY-STEP VOTER REGISTRATION TIMELINE ===
    
    Step 1 — Check Eligibility:
       - You must be an Indian citizen aged 18 or older on the qualifying date (Jan 1st, April 1st, July 1st, or Oct 1st of the year).
       - You must be a resident of the constituency where you wish to register.
    
    Step 2 — Gather Documents:
       - Proof of Age: Birth certificate, Class 10 marksheet, or Aadhaar Card.
       - Proof of Address: Aadhaar Card, utility bills, bank passbook, or rent agreement.
       - Passport-size photograph.
    
    Step 3 — Fill Form 6:
       - Form 6 is the "Application for Inclusion of Name in Electoral Roll."
       - It can be filled online at https://voters.eci.gov.in or offline at the nearest ERO (Electoral Registration Officer) office.
       - Key fields: Full name, date of birth, address, relation (father/mother/husband), constituency details.
    
    Step 4 — Submit Application:
       - Online: Upload scanned documents via the National Voter Service Portal (NVSP).
       - Offline: Submit the filled form with photocopies of documents to the ERO/AERO office.
       - Timeline: Applications are processed within 21-45 days of submission.
    
    Step 5 — Verification:
       - A Booth Level Officer (BLO) will visit your address for physical verification.
       - Ensure someone is present at the registered address during the verification window.
    
    Step 6 — Receive EPIC Card:
       - Once approved, your name appears in the electoral roll.
       - Your Electors Photo Identity Card (EPIC/Voter ID) is dispatched to your address.
       - You can also download the e-EPIC (digital Voter ID) from the ECI website.
    
    === ELECTION DAY TIMELINE ===
    
    Before Polling Day:
       - Check your name on the electoral roll at https://electoralsearch.eci.gov.in
       - Locate your polling station using the Voter Helpline App or by calling 1950.
       - Carry your EPIC card or any of the 12 approved alternative IDs.
    
    On Polling Day:
       - 7:00 AM: Polling stations open.
       - Arrive at your designated polling station with your ID.
       - Your name and identity are verified by the Presiding Officer.
       - You receive indelible ink marking on your left index finger.
       - Cast your vote on the Electronic Voting Machine (EVM).
       - Verify your vote on the Voter Verifiable Paper Audit Trail (VVPAT) slip (visible for 7 seconds).
       - 6:00 PM: Polling stations close. Voters already in queue are allowed to vote.
    
    After Polling Day:
       - EVMs are sealed and transported to the counting center under armed escort.
       - Counting typically happens within 3-5 days after the final phase of polling.
       - Results are announced constituency-by-constituency by the Returning Officer.
       - The Election Commission publishes final results on https://results.eci.gov.in
    
    === ELECTION PROCESS PHASES (General Elections) ===
    
    Phase 1 — Announcement:
       - The Election Commission announces the election schedule and the Model Code of Conduct (MCC) takes effect immediately.
       - Political parties and candidates must adhere to the MCC until results are declared.
    
    Phase 2 — Nomination:
       - Candidates file nomination papers with the Returning Officer.
       - Nominations are scrutinized and candidates may withdraw within the stipulated period.
    
    Phase 3 — Campaigning:
       - Political parties and candidates campaign for votes.
       - Campaigning must stop 48 hours before polling begins ("silence period").
    
    Phase 4 — Polling:
       - Voters cast their ballots at designated polling stations across the constituency.
       - Polling may be conducted in multiple phases across different states.
    
    Phase 5 — Counting & Results:
       - EVMs are opened and counted at designated counting centers.
       - The candidate with the highest votes in a constituency is declared the winner.
       - The party (or coalition) with a majority of seats forms the government.
    
    === ALTERNATIVE VOTER ID DOCUMENTS ===
    
    If your EPIC card is missing, you can use any of these 12 approved IDs at the polling booth:
       - Aadhaar Card
       - PAN Card
       - Unique Disability ID (UDID) Card
       - Service Identity Card with photograph issued by Central/State Govt./PSUs/Public Limited Companies
       - Passbooks with photograph issued by Bank/Post Office
       - Health Insurance Smart Card issued under the scheme of Ministry of Labour
       - Driving License
       - Passport
       - Smart Card issued by RGI under NPR
       - Pension document with photograph
       - Official identity cards issued to MPs/MLAs/MLCs
       - MNREGA Job Card
        
    === FORMS REFERENCE ===
    
       - Form 6: Application for inclusion of name in the electoral roll for first-time voters or voters shifting to a new constituency.
       - Form 6A: Application for inclusion of name in electoral roll by an overseas elector.
       - Form 7: Application for objection to proposed inclusion/for deletion of name in existing electoral roll.
       - Form 8: Application for correction of particulars entered in electoral roll, shifting of residence within constituency, replacement of EPIC, and marking of PwD.
        
    === KEY FACTS ===
    
       - Standard polling hours: 7:00 AM to 6:00 PM.
       - Voters in queue at closing time will be allowed to cast their vote.
       - Electronic Voting Machines (EVMs) and Voter Verifiable Paper Audit Trails (VVPATs) are used.
       - Mobile phones, cameras, and recording devices are strictly prohibited inside the polling booth.
       - Model Code of Conduct: Guidelines for political parties and candidates regarding speeches, polling day conduct, election manifestos, processions, and general behavior during elections.
    """
    return context
