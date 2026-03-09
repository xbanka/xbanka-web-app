export interface Country {
  name: string
  code: string
  flag: string
  dialCode: string
  format: string
}

export const COUNTRIES: Country[] = [
  { name: "Nigeria", code: "NG", flag: "🇳🇬", dialCode: "+234", format: "(XXX) XXX-XXXX" },
  { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1", format: "(XXX) XXX-XXXX" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44", format: "(XXXX) XXXXXX" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1", format: "(XXX) XXX-XXXX" },
  { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61", format: "(X) XXXX XXXX" },
  { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49", format: "(XXX) XXXXXXX" },
  { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33", format: "(X) XXXX XXXX" },
  { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91", format: "(XXXXX) XXXXX" },
  { name: "Japan", code: "JP", flag: "🇯🇵", dialCode: "+81", format: "(XXX) XXXX XXXX" },
  { name: "Brazil", code: "BR", flag: "🇧🇷", dialCode: "+55", format: "(XX) XXXXX-XXXX" },
  { name: "Mexico", code: "MX", flag: "🇲🇽", dialCode: "+52", format: "(XX) XXXX XXXX" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", dialCode: "+27", format: "(XX) XXXX XXXX" },
  { name: "Kenya", code: "KE", flag: "🇰🇪", dialCode: "+254", format: "(XXX) XXXXXX" },
  { name: "Ghana", code: "GH", flag: "🇬🇭", dialCode: "+233", format: "(XXX) XXXXXX" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", dialCode: "+65", format: "XXXX XXXX" },
]

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return COUNTRIES.find(c => c.dialCode === dialCode)
}

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(c => c.code === code)
}
