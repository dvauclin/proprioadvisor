
export interface SubscriptionFormValues {
  options: {
    basicListing: boolean;
    partnerListing: boolean;
    websiteLink: boolean;
    phoneNumber: boolean;
    backlink: boolean;
    conciergeriePageLink: boolean;
  };
  websiteUrl: string;
  phoneNumberValue: string;
  customAmount: string;
  useCustomAmount: boolean;
  password: string;
  confirmPassword: string;
}
