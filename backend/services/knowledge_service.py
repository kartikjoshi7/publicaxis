def get_election_context(query: str) -> str:
    """
    Mock RAG knowledge base returning hardcoded Indian election rules.
    In a production system, this would embed the query and search a vector database.
    """
    context = """
    Essential Indian Election Commission Rules & Information:
    
    1. Alternative Voter ID Documents (if Epic Card is missing):
       - Aadhaar Card
       - PAN Card
       - Unique Disability ID (UDID) Card
       - Service Identity Card with photograph issued to employees by Central/State Govt./PSUs/Public Limited Companies
       - Passbooks with photograph issued by Bank/Post Office
       - Health Insurance Smart Card issued under the scheme of Ministry of Labour
       - Driving License
       - Passport
       - Smart Card issued by RGI under NPR
       - Pension document with photograph
       - Official identity cards issued to MPs/MLAs/MLCs
       - MNREGA Job Card
       
    2. Polling Timings:
       - Standard polling hours are typically from 7:00 AM to 6:00 PM on the designated polling day.
       - Voters in queue at the closing time will be allowed to cast their vote.
       
    3. Forms Purpose:
       - Form 6: Application for inclusion of name in the electoral roll for first-time voters or voters shifting to a new constituency.
       - Form 6A: Application for inclusion of name in electoral roll by an overseas elector.
       - Form 7: Application for objection to proposed inclusion/for deletion of name in existing electoral roll.
       - Form 8: Application for correction of particulars entered in electoral roll, shifting of residence within constituency, replacement of EPIC, and marking of PwD.
       
    4. General Guidelines:
       - A citizen must be 18 years of age or older on the qualifying date (typically Jan 1st, April 1st, July 1st, or Oct 1st of the year) to register.
       - Electronic Voting Machines (EVMs) and Voter Verifiable Paper Audit Trails (VVPATs) are used for voting.
       - Mobile phones, cameras, and any other recording devices are strictly prohibited inside the polling booth.
    """
    return context
