import * as z from "zod";

// trim, lowercase and de-duplicate skills
const skillList = z
  .array(z.string())
  .default([])
  .transform((arr) => [
    ...new Set(arr.map((s) => s.trim().toLowerCase()).filter(Boolean)),
  ]);

const experienceSchema = z.object({
  companyName: z.string().nullish(),
  role: z.string().nullish(),
  startDate: z.string().nullish(), // "YYYY-MM"
  endDate: z.string().nullish(), // "YYYY-MM", null if current
  durationYears: z.number().min(0).nullish(),
  description: z.string().nullish(),
  skillsUsed: skillList,
});

const projectSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  skillsUsed: skillList,
});

const certificationSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
});

const educationSchema = z.object({
  degree: z.string().nullish(),
  institution: z.string().nullish(),
  year: z.string().nullish(),
});

export const profileSchema = z.object({
  name: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  totalExperienceYears: z.number().min(0).max(60).nullish(),
  skills: skillList,
  experiences: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  education: z.array(educationSchema).default([]),
});