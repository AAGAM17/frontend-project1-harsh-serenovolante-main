/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const crm_data: { [key: string]: { contacts: { name: string; role: string; email: string; phone: string; }[]; projects: { current: string; volume: string; materials: string; notes: string; }; } } = {
    'larsen & toubro': {
        'contacts': [
            {
                'name': 'Arjun Sharma',
                'role': 'VP of Procurement',
                'email': 'arjun.sharma@lt.com',
                'phone': '+91-9876543210'
            },
            {
                'name': 'Priya Patel',
                'role': 'VP of Procurement',
                'email': 'priya.patel@lt.com',
                'phone': '+91-9988776655'
            }
        ],
        'projects': {
            'current': 'Mumbai–Ahmedabad High-Speed Rail (MAHSR)',
            'volume': '150,000 MT (Ongoing)',
            'materials': 'High-Strength TMT Bars, HR Plates, LRPC',
            'notes': 'JSW holds >50% market share in steel supply for this project. Strong relationship; exploring opportunities for Delhi–Varanasi HSR project'
        }
    },
    'dilip buildcon': {
        'contacts': [
            {
                'name': 'Rohan Verma',
                'role': 'VP of Procurement',
                'email': 'rohan.verma@dilipbuildcon.com',
                'phone': '+91-9765432109'
            },
            {
                'name': 'Sneha Kapoor',
                'role': 'VP of Procurement',
                'email': 'sneha.kapoor@dilipbuildcon.com',
                'phone': '+91-9654321098'
            }
        ],
        'projects': {
            'current': 'Thoppur Ghat Section (Tamil Nadu)',
            'volume': '25,000 MT (Ongoing)',
            'materials': 'TMT Bars, Structural Steel',
            'notes': 'Focus on timely delivery and customized steel grades'
        }
    },
    'pnc infratech': {
        'contacts': [
            {
                'name': 'Vikram Singh',
                'role': 'VP of Procurement',
                'email': 'vikram.singh@pncinfratech.com',
                'phone': '+91-9543210987'
            },
            {
                'name': 'Deepika Reddy',
                'role': 'VP of Procurement',
                'email': 'deepika.reddy@pncinfratech.com',
                'phone': '+91-9432109876'
            }
        ],
        'projects': {
            'current': 'Western Bhopal Bypass',
            'volume': '30,000 MT (Ongoing)',
            'materials': 'TMT Bars, Cement-Coated Steel',
            'notes': 'Seeking long-term supply agreement'
        }
    },
    'hg infra': {
        'contacts': [
            {
                'name': 'Amit Patel',
                'role': 'VP of Procurement',
                'email': 'amit.patel@hginfra.com',
                'phone': '+91-9321098765'
            },
            {
                'name': 'Neha Sharma',
                'role': 'VP of Procurement',
                'email': 'neha.sharma@hginfra.com',
                'phone': '+91-9210987654'
            }
        ],
        'projects': {
            'current': 'Maharashtra EPC Road Projects',
            'volume': '40,000 MT (Ongoing)',
            'materials': 'Structural Steel, Rebar',
            'notes': 'Focus on green steel options to align with sustainability goals'
        }
    },
    'irb infrastructure': {
        'contacts': [
            {
                'name': 'Suresh Kumar',
                'role': 'VP of Procurement',
                'email': 'suresh.kumar@irb.com',
                'phone': '+91-9109876543'
            },
            {
                'name': 'Anjali Iyer',
                'role': 'VP of Procurement',
                'email': 'anjali.iyer@irb.com',
                'phone': '+91-9098765432'
            }
        ],
        'projects': {
            'current': 'NH-44 Lalitpur-Sagar-Lakhnadon Section',
            'volume': '20,000 MT (Ongoing)',
            'materials': 'High-Tensile Steel, TMT Bars',
            'notes': 'Exploring toll-operate-transfer (TOT) projects partnership'
        }
    },
    'cube highways': {
        'contacts': [
            {
                'name': 'Manish Gupta',
                'role': 'VP of Procurement',
                'email': 'manish.gupta@cubehighways.com',
                'phone': '+91-8987654321'
            },
            {
                'name': 'Kavita Verma',
                'role': 'VP of Procurement',
                'email': 'kavita.verma@cubehighways.com',
                'phone': '+91-8877665544'
            }
        ],
        'projects': {
            'current': 'NH-2 Allahabad Bypass',
            'volume': '15,000 MT (Completed)',
            'materials': 'Reinforcement Steel, Pre-stressed Cables',
            'notes': 'Successful project; seeking future collaborations for highway expansions'
        }
    },
    'gr infraprojects': {
        'contacts': [
            {
                'name': 'Rajesh Khanna',
                'role': 'VP of Procurement',
                'email': 'rajesh.khanna@grinfra.com',
                'phone': '+91-8765432109'
            },
            {
                'name': 'Shweta Singh',
                'role': 'VP of Procurement',
                'email': 'shweta.singh@grinfra.com',
                'phone': '+91-8654321098'
            }
        ],
        'projects': {
            'current': 'Pune Ring Road',
            'volume': '35,000 MT (Ongoing)',
            'materials': 'Structural Steel, TMT Bars',
            'notes': 'Critical project; focusing on just-in-time delivery'
        }
    },
    'afcons infrastructure': {
        'contacts': [
            {
                'name': 'Sandeep Malhotra',
                'role': 'VP of Procurement',
                'email': 'sandeep.malhotra@afcons.com',
                'phone': '+91-8543210987'
            },
            {
                'name': 'Nidhi Joshi',
                'role': 'VP of Procurement',
                'email': 'nidhi.joshi@afcons.com',
                'phone': '+91-8432109876'
            }
        ],
        'projects': {
            'current': 'Mumbai–Ahmedabad HSR Tunneling',
            'volume': '18,000 MT (Ongoing)',
            'materials': 'Tunneling Grade Steel, Support Structures',
            'notes': 'Specialized steel requirements; close technical collaboration'
        }
    },
    'j kumar infraprojects': {
        'contacts': [
            {
                'name': 'Vikrant Kumar',
                'role': 'VP of Procurement',
                'email': 'vikrant.kumar@jkumar.com',
                'phone': '+91-8321098765'
            },
            {
                'name': 'Alisha Khan',
                'role': 'VP of Procurement',
                'email': 'alisha.khan@jkumar.com',
                'phone': '+91-8210987654'
            }
        ],
        'projects': {
            'current': 'Navi Mumbai Coastal Road',
            'volume': '12,000 MT (Ongoing)',
            'materials': 'Corrosion-Resistant Steel, Marine-Grade Rebar',
            'notes': 'Focus on durability in coastal environments'
        }
    },
    'megha engineering': {
        'contacts': [
            {
                'name': 'Gaurav Bhatia',
                'role': 'VP of Procurement',
                'email': 'gaurav.bhatia@meil.in',
                'phone': '+91-8109876543'
            },
            {
                'name': 'Tanvi Reddy',
                'role': 'VP of Procurement',
                'email': 'tanvi.reddy@meil.in',
                'phone': '+91-8098765432'
            }
        ],
        'projects': {
            'current': 'Pune Ring Road, Mahi Multi Villages Scheme',
            'volume': '45,000 MT (Ongoing)',
            'materials': 'High-Grade Steel, Piping Steel',
            'notes': 'Key partner; exploring irrigation and infrastructure projects'
        }
    }
};

const ContactsList = () => {
  const searchParams = useSearchParams();
  const company = searchParams.get("company")?.toLowerCase() || "";
  const [contacts, setContacts] = useState<any[]>([]);
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    console.log(screenSize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screenSize]);
    const getCompanyData = (companyName: string) => {
        if (crm_data[companyName]) {
            return crm_data[companyName];
        }

        for (const crmCompany in crm_data) {
            if (companyName.includes(crmCompany) || crmCompany.includes(companyName)) {
                return crm_data[crmCompany];
            }
        }

        return null;
    };
    
    const init =() => {
        const companyData = getCompanyData(company || "");
    
    setContacts(companyData ? companyData.contacts : []);
    }

  return (
    <div className="absolute top-full left-4 border border-[#E5E5E5] mt-[420px] border-[1.5px] color-white hover:shadow-md rounded-[8px] p-4 mt-2 max-w-[500px] w-[90%] h-[400px] overflow-auto bg-white" style={{maxHeight: `${(screenSize.height*0.2)}px`, marginTop: `${screenSize.height*0.5 + 20}px`}}>
    
      <h2 className="text-lg font-bold mb-4">CRM fetched Contacts</h2>
      <button
        onClick={init}
        className="mt-2 bg-[#1F66F4] text-white py-1 px-3 rounded-md hover:bg-[#3575F5] w-[200px] text-sm"
      >
        {"Fetch"}
      </button>
      <ul>
        {contacts.map((contact, index) => (
          <li key={index} className="border-b py-2">
            <strong>{contact.name}</strong> ({contact.role})<br />
            Email: {contact.email}<br />
            Phone: {contact.phone}
          </li>
        ))}
        {contacts.length == 0 ? <center><p style={{marginTop: `${screenSize.height*0.02}px`}}>No contacts to display</p></center> : <p></p>}
      </ul>
    </div>
  );
};

export default ContactsList;
