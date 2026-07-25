export enum EmployeeRole {
  OWNER = "Owner",
  GLOBAL_ADMIN = "Global_Admin",
  BUSINESS_UNIT_ADMIN = "Business_Unit_Admin",
  BRANCH_ADMIN = "Branch_Admin",
  RECRUITER = "Recruiter",
  INTERVIEWER = "Interviewer",
  HIRING_MANAGER = "Hiring_Manager",
}

export enum EmployeeStatus {
  ACTIVE = "Active",
  PENDING_APPROVAL = "Pending_Approval",
  SUSPENDED = "Suspended",
}

export enum JobStatus {
  DRAFT = "Draft",
  PENDING_APPROVAL = "Pending_Approval",
  ACTIVE = "Active",
  COMPLETED = "Completed",
}

export enum ApprovalStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum OfferStatus {
  DRAFT = "Draft",
  PENDING_APPROVAL = "Pending_Approval",
  APPROVED = "Approved",
  SENT = "Sent",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  WITHDRAWN = "Withdrawn",
}

export enum ApplicantStatus {
  APPLIED = "Applied",
  SCREENING = "Screening",
  SHORTLISTED = "Shortlisted",
  INTERVIEWING = "Interviewing",
  OFFER = "Offer",
  OFFER_ACCEPTED = "OfferAccepted",
  OFFER_REJECTED = "OfferRejected",
  HIRED = "Hired",
  REJECTED = "Rejected",
  WITHDRAWN = "Withdrawn",
  ON_HOLD = "OnHold",
}

export enum Recommendation {
  STRONG_HIRE = "Strong_Hire",
  HIRE = "Hire",
  NO_HIRE = "No_Hire",
  STRONG_NO_HIRE = "Strong_No_Hire",
}

export enum EmploymentType {
  FULL_TIME = "Full_Time",
  PART_TIME = "Part_Time",
  CONTRACT = "Contract",
  INTERNSHIP = "Internship",
}

export enum ExperienceLevel {
  ENTRY = "Entry",
  MID = "Mid",
  SENIOR = "Senior",
  LEAD = "Lead",
  EXECUTIVE = "Executive",
}

export enum RemoteType {
  ONSITE = "Onsite",
  HYBRID = "Hybrid",
  REMOTE = "Remote",
}

export enum RoundCategory {
  SCREENING = "Screening",
  TECHNICAL = "Technical",
  DESIGN = "Design",
  BEHAVIORAL = "Behavioral",
  MANAGEMENT = "Management",
}

export enum QuestionCategory {
  CODING = "Coding",
  SYSTEM_DESIGN = "System_Design",
  SYSTEM_ARCHITECTURE = "System_Architecture",
  BEHAVIORAL = "Behavioral",
  TECHNICAL_THEORY = "Technical_Theory",
  BUSINESS_CASE = "Business_Case",
}

export enum InterviewStatus {
  SCHEDULED = "Scheduled",
  RESCHEDULE_REQUESTED = "Reschedule_Requested",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  ABSENT = "Absent",
}

export enum RescheduleRequestedBy {
  CANDIDATE = "Candidate",
  INTERVIEWER = "Interviewer",
}

export enum RescheduleStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum JobBoardProvider {
  LINKEDIN = "LINKEDIN",
  INDEED = "INDEED",
  NAUKRI = "NAUKRI",
  MONSTER = "MONSTER",
  GLASSDOOR = "GLASSDOOR",
  WELLFOUND = "WELLFOUND",
  GREENHOUSE = "GREENHOUSE",
  LEVER = "LEVER",
}

export enum ConnectionStatus {
  CONNECTED = "Connected",
  EXPIRED = "Expired",
  DISCONNECTED = "Disconnected",
}

export enum JobBoardPostStatus {
  PENDING = "Pending",
  POSTED = "Posted",
  FAILED = "Failed",
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum NotificationType {
  SYSTEM = "System",
  APPLICATION_UPDATE = "Application_Update",
  INTERVIEW_SCHEDULED = "Interview_Scheduled",
  SCREENING_COMPLETED = "Screening_Completed",
  EMPLOYEE_INVITE = "Employee_Invite",
}

export enum Language {
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  PYTHON = "python",
  GO = "go",
  JAVA = "java",
  CPP = "cpp",
  C = "c",
  CSHARP = "csharp",
  RUBY = "ruby",
  RUST = "rust",
  PHP = "php",
}

export enum SubmissionStatus {
  PENDING = "Pending",
  RUNNING = "Running",
  ACCEPTED = "Accepted",
  WRONG_ANSWER = "Wrong_Answer",
  RUNTIME_ERROR = "Runtime_Error",
  TIME_LIMIT_EXCEEDED = "Time_Limit_Exceeded",
  MEMORY_LIMIT_EXCEEDED = "Memory_Limit_Exceeded",
  COMPILATION_ERROR = "Compilation_Error",
}
