/**
 * Work history component
 */

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

interface WorkExperience {
    id: number;
    role: string;
    company: string;
    location: string;
    type: string;
    period: string;
    description: string[];
}

// const workHistory: WorkExperience[] = [
//     {
//         id: 1,
//         role: "Lead Frontend Developer",
//         company: "AsteriskRD",
//         location: "Canada (Remote)",
//         type: "Internship",
//         period: "Feb 2024 - May 2024",
//         description: [
//             "Led frontend development initiatives for the company website from inception to deployment.",
//             "Optimized website performance, resulting in improved load times and user experience.",
//             "Established frontend architecture and coding standards for the development team.",
//             "Collaborated with designers and backend developers to deliver seamless user interfaces.",
//             "Mentored junior developers and conducted code reviews to maintain quality standards.",
//         ],
//     },
//     {
//         id: 2,
//         role: "DevOps Engineer",
//         company: "Hasob Integrated Services",
//         location: "Nigeria",
//         type: "Full-Time",
//         period: "Feb 2025 - Present",
//         description: [
//             "Manage and maintain company servers and applications across local and cloud infrastructure.",
//             "Deploy and orchestrate containerized applications using Kubernetes clusters.",
//             "Implement CI/CD pipelines to streamline deployment processes and improve system reliability.",
//             "Monitor system performance and optimize infrastructure for scalability and security.",
//             "Collaborate with development teams to ensure smooth application deployment and operations.",
//         ],
//     },
//     {
//         id: 3,
//         role: "Frontend Developer & Community Manager",
//         company: "AsteriskRD",
//         location: "Canada (Remote)",
//         type: "Volunteer",
//         period: "Aug 2025 - Present",
//         description: [
//             "Develop and maintain frontend features for company projects using modern web technologies.",
//             "Mentor interns and junior developers, providing guidance on best practices and technical skills.",
//             "Manage developer community initiatives, fostering collaboration and knowledge sharing.",
//             "Coordinate onboarding processes and create learning resources for new team members.",
//         ],
//     },
//     {
//         id: 4,
//         role: "Frontend Developer",
//         company: "Winter Developers",
//         location: "Nigeria",
//         type: "Contract",
//         period: "Sept 2024 - Jan 2025",
//         description: [
//             "Collaborated in a 5-person development team to build a custom e-commerce platform for men's fashion retail.",
//             "Developed responsive product pages, shopping cart functionality, and checkout processes.",
//             "Implemented user authentication and account management features.",
//             "Ensured cross-browser compatibility and mobile responsiveness across the application.",
//             "Worked closely with the client to gather requirements and deliver solutions that met business objectives.",
//         ],
//     },
// ];

const typeColors: Record<string, string> = {
    "Full-Time": "bg-[#E8B84B]/10 text-[#E8B84B] border-[#E8B84B]/20",
    Internship: "bg-white/5 text-white/40 border-white/10",
    Volunteer: "bg-[#E8394D]/10 text-[#E8394D]/80 border-[#E8394D]/20",
    Contract: "bg-white/5 text-white/40 border-white/10",
};

export default function WorkHistory() {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [workHistory, setWorkHistory] = useState<WorkExperience[]>([]);
    const [isFetching, setIsFetching] = useState(true);

    const fetchResume = async () => {
        const { data } = await supabase
            .from("resumes")
            .select("file_url")
            .eq("is_current", true)
            .single();
        if (data) setResumeUrl(data.file_url);
    };

    const fetchWorkHistory = async () => {
        setIsFetching(true);

        const { data, error } = await supabase
            .from("work_history")
            .select("*")
            .order("sort_order", { ascending: false });

        if (error) throw new Error(error.message);

        console.log(data);
        setWorkHistory(data);
        setIsFetching(false);
    };

    useEffect(() => {
        fetchWorkHistory();
        fetchResume();
    }, []);

    return (
        <section className="w-full">
            {/* Download line */}
            <p className="text-base text-white/50 mb-10 leading-relaxed">
                A summary of my past employment experience. You can also{" "}
                <a
                    href={resumeUrl ?? "/files/daniel_resume.pdf"}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#E8B84B]/70 hover:text-[#E8B84B] border-b border-[#E8B84B]/30 hover:border-[#E8B84B] transition-colors"
                >
                    download my resume
                </a>
                .
            </p>

            {/* Timeline */}
            <div className="relative pl-8">
                {/* Vertical line — absolutely positioned, starts and ends at dot centers */}
                <div
                    className="absolute left-[7px] top-3.5 w-px bg-[#E8B84B]/15"
                    style={{ bottom: "14px" }}
                />

                <div className="space-y-6">
                    {isFetching
                        ? Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="relative animate-pulse">
                                  {/* Dot skeleton */}
                                  <div className="absolute -left-8 top-3.5 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E8B84B]/20" />

                                  {/* Card skeleton */}
                                  <div className="bg-[#0F0D2A] border border-[#E8B84B]/10 p-6">
                                      {/* Top row */}
                                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
                                          <div className="space-y-2">
                                              <div className="h-5 bg-white/8 rounded w-48" />
                                              <div className="h-3.5 bg-white/5 rounded w-32" />
                                          </div>
                                          <div className="flex sm:flex-col gap-2 shrink-0">
                                              <div className="h-6 w-20 bg-white/5 rounded" />
                                              <div className="h-3.5 w-28 bg-white/5 rounded" />
                                          </div>
                                      </div>

                                      {/* Divider */}
                                      <div className="h-px bg-[#E8B84B]/8 mb-4" />

                                      {/* Description lines */}
                                      <div className="space-y-2.5">
                                          <div className="h-3 bg-white/5 rounded w-full" />
                                          <div className="h-3 bg-white/5 rounded w-5/6" />
                                          <div className="h-3 bg-white/5 rounded w-4/6" />
                                      </div>
                                  </div>
                              </div>
                          ))
                        : workHistory.map((item, index) => {
                              const {
                                  id,
                                  role,
                                  company,
                                  location,
                                  type,
                                  period,
                                  description,
                              } = item;
                              const isFirst = index === 0;

                              return (
                                  <div key={id} className="relative">
                                      {/* Dot — centered on the line at left-[7px], offset back by half its width (8px) */}
                                      <div
                                          className={`absolute -left-8 top-3.5 -translate-y-1/2 w-4 h-4 rounded-full border-2 z-10 ${
                                              isFirst
                                                  ? "bg-[#E8B84B] border-[#E8B84B] shadow-[0_0_12px_rgba(232,184,75,0.45)]"
                                                  : "bg-[#0A0820] border-[#E8B84B]/35"
                                          }`}
                                      />

                                      {/* Card */}
                                      <div className="bg-[#0F0D2A] border border-[#E8B84B]/10 hover:border-[#E8B84B]/25 transition-all duration-200 p-6">
                                          {/* Top row */}
                                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                              <div className="flex-1 min-w-0">
                                                  <div className="flex items-center gap-2.5 mb-1.5">
                                                      <h3 className="text-lg font-semibold text-white tracking-tight">
                                                          {role}
                                                      </h3>
                                                      {isFirst && (
                                                          <span className="shrink-0 text-[11px] tracking-widest uppercase px-2 py-0.5 bg-[#E8B84B]/10 text-[#E8B84B] border border-[#E8B84B]/20">
                                                              Latest
                                                          </span>
                                                      )}
                                                  </div>
                                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                      <span className="text-sm text-white/50 font-medium">
                                                          {company}
                                                      </span>
                                                      <span className="text-white/20 text-[10px]">
                                                          ·
                                                      </span>
                                                      <span className="text-sm text-white/35">
                                                          {location}
                                                      </span>
                                                  </div>
                                              </div>

                                              {/* Period + type */}
                                              <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
                                                  <span
                                                      className={`text-[11px] tracking-widest uppercase px-2.5 py-1 border ${typeColors[type] ?? "bg-white/5 text-white/40 border-white/10"}`}
                                                  >
                                                      {type}
                                                  </span>
                                                  <span className="text-xs text-white/25 tracking-wider">
                                                      {period}
                                                  </span>
                                              </div>
                                          </div>

                                          {/* Divider */}
                                          <div className="h-px bg-[#E8B84B]/8 mb-4" />

                                          {/* Description */}
                                          <ul className="space-y-2">
                                              {description.map((point, i) => (
                                                  <li
                                                      key={i}
                                                      className="flex items-start gap-3 text-sm text-white/35 leading-relaxed"
                                                  >
                                                      <span className="shrink-0 mt-[5px] w-1 h-1 bg-[#E8B84B]/30 rounded-full" />
                                                      {point}
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                  </div>
                              );
                          })}
                </div>

                <div className="space-y-6"></div>
            </div>
        </section>
    );
}
