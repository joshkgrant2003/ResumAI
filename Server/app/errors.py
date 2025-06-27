class JobScrapingException(Exception):
    """Base class for job scraping-related issues."""

    pass

class JobBlockedException(JobScrapingException):
    """Raised when a job site returns a security page or 403."""

    def __init__(self, message="The job page appears to be blocked or restricted."):
        self.message = message
        super().__init__(self.message)

class JobParsingException(JobScrapingException):
    """Raised when parsing fails due to unexpected structure or empty content."""

    def __init__(self, message="Failed to parse job description from the page."):
        self.message = message
        super().__init__(self.message)