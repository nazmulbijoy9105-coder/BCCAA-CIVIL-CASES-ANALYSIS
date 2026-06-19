import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initialize GoogleGenAI SDK with user_agent for telemetry to prevent loading-time crash if key is undefined
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured in the developer environment. Please set it as an environment variable or secret in the Vercel dashboard / .env file.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Case Analysis Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { factPattern, focusDomain } = req.body;

    if (!factPattern) {
      return res.status(400).json({ error: "Fact pattern is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured in the developer environment.",
      });
    }

    const systemInstruction = `You are a supreme legal expert specializing in Bangladesh Civil Law, Civil Procedure Code (CPC) 1908, the Evidence Act 1872, the Limitation Act 1908, the Specific Relief Act (SRA) 1877, the Transfer of Property Act 1882, the Registration Act 1908, and related statutes.
Your mission is to perform an exhaustive, hallucination-free legal analysis of any provided civil case fact pattern following the 14-stage "Bangladesh Civil Case Analysis Architecture" (BCCAA).
You must output a highly structured JSON document conforming to the exact schema requested. Provide extensive, realistic legal details, genuine statute citations, and specific analytical tables.

Statutory Context for your analysis:
- Assistant Judge Court: Up to Tk. 15 Lakh.
- Senior Assistant Judge Court: Up to Tk. 25 Lakh.
- Joint District Judge Court: Up to Tk. 1 Crore.
- District Judge Court: Unlimited original civil jurisdiction.
- Limitation Act check is MANDATORY, check cause of action accrual date and relevant articles (e.g. Art 113 for specific performance, Art 142/144 for recovery of possession, etc.).
- SRA 1877 Injunctions: prima facie case, balance of convenience, irreparable loss.
- High Court Division and Appellate Division pathways.
- Conventional court stages in Bangladesh (Institution, Service, WS, Replication, O.XIV issue framing, Plaintiff evidence, Defendant evidence, Arguments, Judgment, Decree, Execution).

Make sure all citations (e.g. Sections, Orders, Rules) are strictly accurate and real under Bangladeshi legal system. Use highly professional, court-grade language.`;

    const prompt = `Analyze the following Civil Fact Pattern following the BCCAA stages:
Fact Pattern:
"${factPattern}"

Focus Civil Domain (if specified): ${focusDomain || "Auto-detect"}

You MUST provide your response strictly in the requested JSON structure. Do not include markdown code block formatting inside the JSON values unless appropriate (markdown is allowed in detailed description fields for pleasant formatting). Ensure the JSON is valid.`;

    let response;
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    const attemptsPerModel = 2;
    const totalAttempts = modelsToTry.length * attemptsPerModel;
    let delay = 1500;
    
    for (let attempt = 1; attempt <= totalAttempts; attempt++) {
      const modelIndex = Math.floor((attempt - 1) / attemptsPerModel) % modelsToTry.length;
      const currentModel = modelsToTry[modelIndex];
      try {
        console.log(`BCCAA Audit: Generating content using model ${currentModel} (Attempt ${attempt}/${totalAttempts})...`);
        response = await getAI().models.generateContent({
          model: currentModel,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: [
                "stage0", "stage1", "stage2", "stage3", "stage4", "stage5",
                "stage6", "stage7", "stage8", "stage9", "stage10", "stage11",
                "stage12", "stage13"
              ],
              properties: {
                stage0: {
                  type: Type.OBJECT,
                  description: "STAGE 0 - FACT MATRIX",
                  required: ["chronology", "admittedFacts", "disputedFacts", "inferredFacts", "liabilityFacts", "quantumFacts"],
                  properties: {
                    chronology: {
                      type: Type.ARRAY,
                      description: "Chronological event sequence with dates, parties, acts",
                      items: {
                        type: Type.OBJECT,
                        required: ["date", "event", "partiesInvolved", "statutorySignificance"],
                        properties: {
                          date: { type: Type.STRING },
                          event: { type: Type.STRING },
                          partiesInvolved: { type: Type.STRING },
                          statutorySignificance: { type: Type.STRING }
                        }
                      }
                    },
                    admittedFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    disputedFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    inferredFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    liabilityFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    quantumFacts: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                stage1: {
                  type: Type.OBJECT,
                  description: "STAGE 1 - CIVIL LAW AREA DETERMINATION",
                  required: ["primaryDomain", "subsidiaryDomains", "triggerFacts"],
                  properties: {
                    primaryDomain: { type: Type.STRING },
                    subsidiaryDomains: { type: Type.ARRAY, items: { type: Type.STRING } },
                    triggerFacts: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          domain: { type: Type.STRING },
                          fact: { type: Type.STRING },
                          statutoryTrigger: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                stage2: {
                  type: Type.OBJECT,
                  description: "STAGE 2 - APPLICABLE LEGISLATION MAP",
                  required: ["primaryAct", "relevantSections", "precedents", "equityPrinciples"],
                  properties: {
                    primaryAct: { type: Type.STRING },
                    relevantSections: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          actName: { type: Type.STRING },
                          sectionOrRule: { type: Type.STRING },
                          purpose: { type: Type.STRING }
                        }
                      }
                    },
                    precedents: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          citation: { type: Type.STRING },
                          court: { type: Type.STRING },
                          holding: { type: Type.STRING },
                          relevance: { type: Type.STRING }
                        }
                      }
                    },
                    equityPrinciples: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                stage3: {
                  type: Type.OBJECT,
                  description: "STAGE 3 - LIMITATION - MANDATORY CHECK",
                  required: ["accrualDate", "prescribedPeriod", "limitationArticle", "isTimeBarred", "exceptionsOrExtensions", "preliminaryAnalysis"],
                  properties: {
                    accrualDate: { type: Type.STRING },
                    prescribedPeriod: { type: Type.STRING },
                    limitationArticle: { type: Type.STRING },
                    isTimeBarred: { type: Type.BOOLEAN },
                    exceptionsOrExtensions: { type: Type.STRING, description: "Acknowledgment (s.18), Part Payment (s.19), etc." },
                    preliminaryAnalysis: { type: Type.STRING }
                  }
                },
                stage4: {
                  type: Type.OBJECT,
                  description: "STAGE 4 - PARTY ANALYSIS",
                  required: ["plaintiffs", "defendants", "joinderIssues", "locusStandiSummary"],
                  properties: {
                    plaintiffs: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          legalIdentity: { type: Type.STRING },
                          capacity: { type: Type.STRING },
                          causeOfActionAccess: { type: Type.STRING }
                        }
                      }
                    },
                    defendants: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          legalIdentity: { type: Type.STRING },
                          capacity: { type: Type.STRING },
                          liabilityType: { type: Type.STRING }
                        }
                      }
                    },
                    joinderIssues: { type: Type.STRING },
                    locusStandiSummary: { type: Type.STRING }
                  }
                },
                stage5: {
                  type: Type.OBJECT,
                  description: "STAGE 5 - JURISDICTION DETERMINATION",
                  required: ["territorial", "pecuniary", "subjectMatter", "objectionStrategy"],
                  properties: {
                    territorial: {
                      type: Type.OBJECT,
                      required: ["rule", "governingSection", "jurisdictionalFacts"],
                      properties: {
                        rule: { type: Type.STRING },
                        governingSection: { type: Type.STRING },
                        jurisdictionalFacts: { type: Type.STRING }
                      }
                    },
                    pecuniary: {
                      type: Type.OBJECT,
                      required: ["valuation", "courtLevel", "pecuniaryLimits", "suitsValuationActNotes"],
                      properties: {
                        valuation: { type: Type.STRING },
                        courtLevel: { type: Type.STRING },
                        pecuniaryLimits: { type: Type.STRING },
                        suitsValuationActNotes: { type: Type.STRING }
                      }
                    },
                    subjectMatter: {
                      type: Type.OBJECT,
                      required: ["isExcluded", "forum", "governingStatute"],
                      properties: {
                        isExcluded: { type: Type.BOOLEAN },
                        forum: { type: Type.STRING },
                        governingStatute: { type: Type.STRING }
                      }
                    },
                    objectionStrategy: { type: Type.STRING }
                  },
                },
                stage6: {
                  type: Type.OBJECT,
                  description: "STAGE 6 - PLEADINGS ANALYSIS",
                  required: ["plaintChecklist", "groundsForRejection", "writtenStatementDeemedAdmissions", "counterclaimsOrSetOff"],
                  properties: {
                    plaintChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
                    groundsForRejection: { type: Type.ARRAY, items: { type: Type.STRING }, description: "O.VII R.11 CPC triggers" },
                    writtenStatementDeemedAdmissions: { type: Type.STRING },
                    counterclaimsOrSetOff: { type: Type.STRING }
                  }
                },
                stage7: {
                  type: Type.OBJECT,
                  description: "STAGE 7 - ISSUE FRAMING",
                  required: ["issues"],
                  properties: {
                    issues: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        required: ["issueNo", "title", "type", "burden", "evidenceRequired"],
                        properties: {
                          issueNo: { type: Type.INTEGER },
                          title: { type: Type.STRING },
                          type: { type: Type.STRING, description: "Fact / Law / Mixed" },
                          burden: { type: Type.STRING, description: "Plaintiff / Defendant + Evidence Act citation" },
                          evidenceRequired: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                stage8: {
                  type: Type.OBJECT,
                  description: "STAGE 8 - EVIDENCE ANALYSIS",
                  required: ["evidenceList", "burdenAssignments", "statutoryPresumptions"],
                  properties: {
                    evidenceList: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          item: { type: Type.STRING },
                          source: { type: Type.STRING },
                          type: { type: Type.STRING, description: "Oral / Documentary / Certified Copy" },
                          governingSection: { type: Type.STRING },
                          admissibilityChallenge: { type: Type.STRING }
                        }
                      }
                    },
                    burdenAssignments: { type: Type.ARRAY, items: { type: Type.STRING } },
                    statutoryPresumptions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          statuteSection: { type: Type.STRING },
                          presumptionStyle: { type: Type.STRING },
                          effectOnCase: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                stage9: {
                  type: Type.OBJECT,
                  description: "STAGE 9 - ISSUE-WISE ANALYSIS",
                  required: ["issueDetails"],
                  properties: {
                    issueDetails: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        required: ["issueNo", "issueTitle", "plaintiffPosition", "defendantPosition", "courtAnalysis", "projectedFinding"],
                        properties: {
                          issueNo: { type: Type.INTEGER },
                          issueTitle: { type: Type.STRING },
                          plaintiffPosition: { type: Type.STRING },
                          defendantPosition: { type: Type.STRING },
                          courtAnalysis: { type: Type.STRING },
                          projectedFinding: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                stage10: {
                  type: Type.OBJECT,
                  description: "STAGE 10 - EQUITY PRINCIPLES",
                  required: ["applicablePrinciples", "discretionaryReliefCheck"],
                  properties: {
                    applicablePrinciples: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          principle: { type: Type.STRING },
                          application: { type: Type.STRING },
                          weight: { type: Type.STRING }
                        }
                      }
                    },
                    discretionaryReliefCheck: { type: Type.STRING, description: "SRA 1877 s.12, s.42, s.52-57 limits and conditions" }
                  }
                },
                stage11: {
                  type: Type.OBJECT,
                  description: "STAGE 11 - CONVENTIONAL CIVIL COURT STAGES",
                  required: ["timelineProgress"],
                  properties: {
                    timelineProgress: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          stageName: { type: Type.STRING },
                          cpcReference: { type: Type.STRING },
                          subActions: { type: Type.STRING },
                          strategicPlay: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                stage12: {
                  type: Type.OBJECT,
                  description: "STAGE 12 - APPEAL PATHWAY",
                  required: ["appealNodes"],
                  properties: {
                    appealNodes: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          level: { type: Type.STRING },
                          authority: { type: Type.STRING },
                          scope: { type: Type.STRING },
                          governingSection: { type: Type.STRING }
                        }
                      }
                    }
                  }
                },
                stage13: {
                  type: Type.OBJECT,
                  description: "STAGE 13 - FINAL SYNTHESIS",
                  required: ["overview", "reliefDecree", "costsApportionment", "equitableBars", "executionPathway"],
                  properties: {
                    overview: { type: Type.STRING },
                    reliefDecree: { type: Type.STRING, description: "Precise relief and decree terms with interest if applicable under s.34 CPC" },
                    costsApportionment: { type: Type.STRING },
                    equitableBars: { type: Type.STRING },
                    executionPathway: { type: Type.STRING, description: "Execution processes under Order XXI CPC" }
                  }
                }
              }
            },
          },
        });
        break; // break loop on success
      } catch (err: any) {
        console.warn(`Gemini API attempt ${attempt} failed: ${err.message || err}`);
        const errMsg = (err.message || "").toLowerCase();
        const isTemporary = errMsg.includes("503") || errMsg.includes("unavailable") || errMsg.includes("busy") || errMsg.includes("limit") || errMsg.includes("exhausted") || errMsg.includes("demand");
        if (isTemporary && attempt < totalAttempts) {
          console.log(`Retrying Gemini request after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw err;
        }
      }
    }

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Legal Analysis failed:", error);
    res.status(500).json({ error: error.message || "An error occurred during case analysis." });
  }
});

// Configure Vite middleware or serve static assets
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BCCAA Server booted. Port: ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  bootstrap();
}

export default app;
