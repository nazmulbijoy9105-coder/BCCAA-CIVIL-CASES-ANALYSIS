export interface SampleCase {
  id: string;
  title: string;
  category: string;
  primaryAct: string;
  description: string;
  factPattern: string;
}

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: "land-specific-performance",
    title: "Specific Performance of Land Contract (Baininama)",
    category: "Contract / Immovable Property",
    primaryAct: "Specific Relief Act 1877 (Section 12) & Transfer of Property Act 1882",
    description: "Dispute involving a registered agreement for sale where the vendor refuses to execute the final transfer deed despite receiving part payment and the purchaser showing readiness to pay the balance.",
    factPattern: `1. On March 10, 2025, Rafiqul Islam (Purchaser/Plaintiff) entered into a written and registered contract for sale (Baininama) with Kamal Hossain (Vendor/Defendant) for 3 Decimals of land under Mouza: Mirpur, Dhaka (S.A. Dag No: 402, R.S. Dag No: 812).
2. The total consideration was settled at BDT 1,20,00,000 (One Crore Twenty Lakh Taka). Rafiqul paid BDT 50,00,000 as advance (Baina money) at the time of execution.
3. The stipulated period for completion of the transfer (execution and registration of the Saf-Kabala deed) was 6 months—expiring on September 15, 2025—upon payment of the balance BDT 70,00,000.
4. On August 20, 2025, Rafiqul managed the balance amount, obtained a pay-order from Agrani Bank, and sent a letter to Kamal requesting him to receive the remainder and register the deed.
5. Kamal ignored the request. On September 5, 2025, Rafiqul physically visited Kamal's residence with two witnesses, offering the balance cash/pay-order, but Kamal refused to execute.
6. The contract period expired on September 15, 2025. On September 28, 2025, Rafiqul served a formal Registry Legal Notice calling upon Kamal to perform. Kamal replied falsely on October 10, 2025, claiming Rafiqul failed to organize funds and that the contract was terminated.
7. Rafiqul wishes to file a Suit for Specific Performance of Contract under Section 12 of the Specific Relief Act, 1877, accompanied by an application for ad-interim injunction to prevent Kamal from selling the land to a third party.`
  },
  {
    id: "partition-declaration-title",
    title: "Declaration of Title & Partition of Inherited Land",
    category: "Immovable Property / Succession",
    primaryAct: "Partition Act 1893, State Acquisition & Tenancy Act 1950 & CPC 1908",
    description: "Sisters seeking partition by metes and bounds of ancestral land in Sylhet where brothers fraudulently recorded their names exclusively in the RS Khatian and are threatening dispossession.",
    factPattern: `1. The suit land measuring 15 decimals in Mouza: Shahi Eidgah, Sylhet, originally belonged to late Abdus Sobhan. He died intestate in 2018, leaving behind two sons (Anisur Rahman, Shakil Rahman) and one daughter (Hosne Ara Begum, Plaintiff).
2. Under Muslim Sharia law, Hosne Ara Begum is entitled to a 1/5th share (3 decimals), and the two brothers are entitled to 2/5ths share each (6 decimals each).
3. The property is currently joint and unpartitioned, with Hosne Ara Begum residing in a small brick-built room on the southern edge.
4. During the recent R.S. Survey of 2022, the brothers fraudulently conspired with local land survey officials and recorded the entire 15 decimals in their names under R.S. Khatian No: 442, completely deleting Hosne Ara Begum's name.
5. On April 12, 2026, Hosne Ara Begum demanded a formal amicable partition (Faraiz of share) so she could construct a separate dwelling. Her brothers vehemently refused and threatened to tear down her brick room on May 10, 2026, claiming she has no title or share.
6. Hosne Ara Begum seeks to file a civil suit for a declaration of her 1/5th share title, declaration of the R.S. Khatian entry as void/illegal, partition of the joint land, and permanent injunction against her dispossession.`
  },
  {
    id: "commercial-lease-eviction",
    title: "Commercial Tenancy Eviction & Rent Recovery",
    category: "Tenancy / Recovery of Money",
    primaryAct: "Transfer of Property Act 1882 (Section 106 & 111) & CPC 1908",
    description: "Landlord seeking recovery of possession of a commercial retail space in Dhanmondi due to non-payment of rent for six months, unauthorized subletting, and expiry of lease term.",
    factPattern: `1. Nurul Haque (Landlord/Plaintiff) is the absolute owner of a commercial showroom space on the ground floor of Holding No: 42, Road No: 27, Dhanmondi R/A, Dhaka.
2. By a written, notarized Lease Deed dated January 1, 2023, the space was let out to Karim Bakery Ltd (Represented by Managing Director Karimuddin, Defendant) for a period of 3 years expiring on December 31, 2025. The monthly rent was agreed at BDT 1,50,000, payable within the 5th day of each calendar month.
3. Karim Bakery Ltd paid rent regularly until June 2025. Since July 2025, they default in payment of rent, leaving BDT 9,00,000 in arrears for 6 months (July to December 2025).
4. The agreement strictly barred subletting or material alteration of the structure. However, in September 2025, Karimuddin subletted the rear portion to a third-party juices shop without written consent and knocked down an internal partition wall.
5. On November 5, 2025, Nurul Haque served a 15-day statutory eviction notice under Section 106 of the Transfer of Property Act, 1882, terminating the tenancy on grounds of breach and default, demanding vacant possession by November 30, 2025.
6. Karimuddin received the notice on November 8, 2025, but refused to vacate, claiming he spent BDT 20,00,000 on high-end interior decoration and that the eviction notice is invalid.
7. The lease reached its natural term expiry on December 31, 2025. Nurul Haque seeks to file a suit for recovery of possession, outstanding arrears of BDT 9,00,000, and mesne profits at BDT 10,000 per day since January 1, 2026, for unlawful holding.`
  }
];
