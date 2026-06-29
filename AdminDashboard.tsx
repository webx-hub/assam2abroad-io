/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Course {
  id: string;
  level: string;
  fee: number;
  description: string;
  duration: string;
  targetAudience: string;
  features: string[];
}

export interface Installment {
  step: string;
  amount: number;
  due: string;
}

export interface CourseFeature {
  title: string;
  description: string;
  iconName: string;
}

export interface OtherEnquiry {
  id: string;
  title: string;
  shortText: string;
  fullDetails: string;
  eligibility: string[];
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  courseOrProgram: string;
  reviewText: string;
  rating: number;
  avatarUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type EnquiryType =
  | 'German Language Course'
  | 'Ausbildung'
  | 'Bachelor’s'
  | 'Master’s'
  | 'Opportunity Card'
  | 'General Enquiry';

export type GermanLevelType =
  | 'A1'
  | 'A2'
  | 'B1'
  | 'B2'
  | 'A1 to B1 Package'
  | 'A1 to B2 Package'
  | 'None';

export interface EnquiryFormData {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  country: string;
  enquiryType: EnquiryType;
  germanLevel: GermanLevelType;
  message: string;
}
