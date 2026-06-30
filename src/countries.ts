export interface Country {
  name: string;
  iso2: string;
  iso3: string;
  callingCode: string;
  defaultCurrency: string;
  region: string;
  vatRegion: string;
  vatType: string;
}

export const COUNTRIES = [
  {
    "name": "Afghanistan",
    "iso2": "AF",
    "iso3": "AFG",
    "callingCode": "+93",
    "defaultCurrency": "AFN",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Åland Islands",
    "iso2": "AX",
    "iso3": "ALA",
    "callingCode": "+35818",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Albania",
    "iso2": "AL",
    "iso3": "ALB",
    "callingCode": "+355",
    "defaultCurrency": "ALL",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Algeria",
    "iso2": "DZ",
    "iso3": "DZA",
    "callingCode": "+213",
    "defaultCurrency": "DZD",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "American Samoa",
    "iso2": "AS",
    "iso3": "ASM",
    "callingCode": "+1684",
    "defaultCurrency": "USD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Andorra",
    "iso2": "AD",
    "iso3": "AND",
    "callingCode": "+376",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Angola",
    "iso2": "AO",
    "iso3": "AGO",
    "callingCode": "+244",
    "defaultCurrency": "AOA",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Anguilla",
    "iso2": "AI",
    "iso3": "AIA",
    "callingCode": "+1264",
    "defaultCurrency": "XCD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Antarctica",
    "iso2": "AQ",
    "iso3": "ATA",
    "callingCode": "",
    "defaultCurrency": "USD",
    "region": "Antarctic",
    "vatRegion": "Antarctic",
    "vatType": "Indirect tax"
  },
  {
    "name": "Antigua and Barbuda",
    "iso2": "AG",
    "iso3": "ATG",
    "callingCode": "+1268",
    "defaultCurrency": "XCD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Argentina",
    "iso2": "AR",
    "iso3": "ARG",
    "callingCode": "+54",
    "defaultCurrency": "ARS",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Armenia",
    "iso2": "AM",
    "iso3": "ARM",
    "callingCode": "+374",
    "defaultCurrency": "AMD",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Aruba",
    "iso2": "AW",
    "iso3": "ABW",
    "callingCode": "+297",
    "defaultCurrency": "AWG",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Australia",
    "iso2": "AU",
    "iso3": "AUS",
    "callingCode": "+61",
    "defaultCurrency": "AUD",
    "region": "Oceania",
    "vatRegion": "Australia",
    "vatType": "GST"
  },
  {
    "name": "Austria",
    "iso2": "AT",
    "iso3": "AUT",
    "callingCode": "+43",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Azerbaijan",
    "iso2": "AZ",
    "iso3": "AZE",
    "callingCode": "+994",
    "defaultCurrency": "AZN",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Bahamas",
    "iso2": "BS",
    "iso3": "BHS",
    "callingCode": "+1242",
    "defaultCurrency": "BSD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Bahrain",
    "iso2": "BH",
    "iso3": "BHR",
    "callingCode": "+973",
    "defaultCurrency": "BHD",
    "region": "Asia",
    "vatRegion": "GCC",
    "vatType": "VAT"
  },
  {
    "name": "Bangladesh",
    "iso2": "BD",
    "iso3": "BGD",
    "callingCode": "+880",
    "defaultCurrency": "BDT",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Barbados",
    "iso2": "BB",
    "iso3": "BRB",
    "callingCode": "+1246",
    "defaultCurrency": "BBD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Belarus",
    "iso2": "BY",
    "iso3": "BLR",
    "callingCode": "+375",
    "defaultCurrency": "BYN",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Belgium",
    "iso2": "BE",
    "iso3": "BEL",
    "callingCode": "+32",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Belize",
    "iso2": "BZ",
    "iso3": "BLZ",
    "callingCode": "+501",
    "defaultCurrency": "BZD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Benin",
    "iso2": "BJ",
    "iso3": "BEN",
    "callingCode": "+229",
    "defaultCurrency": "XOF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Bermuda",
    "iso2": "BM",
    "iso3": "BMU",
    "callingCode": "+1441",
    "defaultCurrency": "BMD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Bhutan",
    "iso2": "BT",
    "iso3": "BTN",
    "callingCode": "+975",
    "defaultCurrency": "BTN",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Bolivia",
    "iso2": "BO",
    "iso3": "BOL",
    "callingCode": "+591",
    "defaultCurrency": "BOB",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Bosnia and Herzegovina",
    "iso2": "BA",
    "iso3": "BIH",
    "callingCode": "+387",
    "defaultCurrency": "BAM",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Botswana",
    "iso2": "BW",
    "iso3": "BWA",
    "callingCode": "+267",
    "defaultCurrency": "BWP",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Bouvet Island",
    "iso2": "BV",
    "iso3": "BVT",
    "callingCode": "+47",
    "defaultCurrency": "USD",
    "region": "Antarctic",
    "vatRegion": "Antarctic",
    "vatType": "Indirect tax"
  },
  {
    "name": "Brazil",
    "iso2": "BR",
    "iso3": "BRA",
    "callingCode": "+55",
    "defaultCurrency": "BRL",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "British Indian Ocean Territory",
    "iso2": "IO",
    "iso3": "IOT",
    "callingCode": "+246",
    "defaultCurrency": "USD",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "British Virgin Islands",
    "iso2": "VG",
    "iso3": "VGB",
    "callingCode": "+1284",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Brunei",
    "iso2": "BN",
    "iso3": "BRN",
    "callingCode": "+673",
    "defaultCurrency": "BND",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Bulgaria",
    "iso2": "BG",
    "iso3": "BGR",
    "callingCode": "+359",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Burkina Faso",
    "iso2": "BF",
    "iso3": "BFA",
    "callingCode": "+226",
    "defaultCurrency": "XOF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Burundi",
    "iso2": "BI",
    "iso3": "BDI",
    "callingCode": "+257",
    "defaultCurrency": "BIF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Cambodia",
    "iso2": "KH",
    "iso3": "KHM",
    "callingCode": "+855",
    "defaultCurrency": "KHR",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Cameroon",
    "iso2": "CM",
    "iso3": "CMR",
    "callingCode": "+237",
    "defaultCurrency": "XAF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Canada",
    "iso2": "CA",
    "iso3": "CAN",
    "callingCode": "+1",
    "defaultCurrency": "CAD",
    "region": "Americas",
    "vatRegion": "Canada",
    "vatType": "GST"
  },
  {
    "name": "Cape Verde",
    "iso2": "CV",
    "iso3": "CPV",
    "callingCode": "+238",
    "defaultCurrency": "CVE",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Caribbean Netherlands",
    "iso2": "BQ",
    "iso3": "BES",
    "callingCode": "+599",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Cayman Islands",
    "iso2": "KY",
    "iso3": "CYM",
    "callingCode": "+1345",
    "defaultCurrency": "KYD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Central African Republic",
    "iso2": "CF",
    "iso3": "CAF",
    "callingCode": "+236",
    "defaultCurrency": "XAF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Chad",
    "iso2": "TD",
    "iso3": "TCD",
    "callingCode": "+235",
    "defaultCurrency": "XAF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Chile",
    "iso2": "CL",
    "iso3": "CHL",
    "callingCode": "+56",
    "defaultCurrency": "CLP",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "China",
    "iso2": "CN",
    "iso3": "CHN",
    "callingCode": "+86",
    "defaultCurrency": "CNY",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Christmas Island",
    "iso2": "CX",
    "iso3": "CXR",
    "callingCode": "+61",
    "defaultCurrency": "AUD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Cocos (Keeling) Islands",
    "iso2": "CC",
    "iso3": "CCK",
    "callingCode": "+61",
    "defaultCurrency": "AUD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Colombia",
    "iso2": "CO",
    "iso3": "COL",
    "callingCode": "+57",
    "defaultCurrency": "COP",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Comoros",
    "iso2": "KM",
    "iso3": "COM",
    "callingCode": "+269",
    "defaultCurrency": "KMF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Congo",
    "iso2": "CG",
    "iso3": "COG",
    "callingCode": "+242",
    "defaultCurrency": "XAF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Cook Islands",
    "iso2": "CK",
    "iso3": "COK",
    "callingCode": "+682",
    "defaultCurrency": "CKD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Costa Rica",
    "iso2": "CR",
    "iso3": "CRI",
    "callingCode": "+506",
    "defaultCurrency": "CRC",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Croatia",
    "iso2": "HR",
    "iso3": "HRV",
    "callingCode": "+385",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Cuba",
    "iso2": "CU",
    "iso3": "CUB",
    "callingCode": "+53",
    "defaultCurrency": "CUC",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Curaçao",
    "iso2": "CW",
    "iso3": "CUW",
    "callingCode": "+599",
    "defaultCurrency": "ANG",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Cyprus",
    "iso2": "CY",
    "iso3": "CYP",
    "callingCode": "+357",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Czechia",
    "iso2": "CZ",
    "iso3": "CZE",
    "callingCode": "+420",
    "defaultCurrency": "CZK",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Denmark",
    "iso2": "DK",
    "iso3": "DNK",
    "callingCode": "+45",
    "defaultCurrency": "DKK",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Djibouti",
    "iso2": "DJ",
    "iso3": "DJI",
    "callingCode": "+253",
    "defaultCurrency": "DJF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Dominica",
    "iso2": "DM",
    "iso3": "DMA",
    "callingCode": "+1767",
    "defaultCurrency": "XCD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Dominican Republic",
    "iso2": "DO",
    "iso3": "DOM",
    "callingCode": "+1809",
    "defaultCurrency": "DOP",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "DR Congo",
    "iso2": "CD",
    "iso3": "COD",
    "callingCode": "+243",
    "defaultCurrency": "CDF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Ecuador",
    "iso2": "EC",
    "iso3": "ECU",
    "callingCode": "+593",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Egypt",
    "iso2": "EG",
    "iso3": "EGY",
    "callingCode": "+20",
    "defaultCurrency": "EGP",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "El Salvador",
    "iso2": "SV",
    "iso3": "SLV",
    "callingCode": "+503",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Equatorial Guinea",
    "iso2": "GQ",
    "iso3": "GNQ",
    "callingCode": "+240",
    "defaultCurrency": "XAF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Eritrea",
    "iso2": "ER",
    "iso3": "ERI",
    "callingCode": "+291",
    "defaultCurrency": "ERN",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Estonia",
    "iso2": "EE",
    "iso3": "EST",
    "callingCode": "+372",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Eswatini",
    "iso2": "SZ",
    "iso3": "SWZ",
    "callingCode": "+268",
    "defaultCurrency": "SZL",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Ethiopia",
    "iso2": "ET",
    "iso3": "ETH",
    "callingCode": "+251",
    "defaultCurrency": "ETB",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Falkland Islands",
    "iso2": "FK",
    "iso3": "FLK",
    "callingCode": "+500",
    "defaultCurrency": "FKP",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Faroe Islands",
    "iso2": "FO",
    "iso3": "FRO",
    "callingCode": "+298",
    "defaultCurrency": "DKK",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Fiji",
    "iso2": "FJ",
    "iso3": "FJI",
    "callingCode": "+679",
    "defaultCurrency": "FJD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Finland",
    "iso2": "FI",
    "iso3": "FIN",
    "callingCode": "+358",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "France",
    "iso2": "FR",
    "iso3": "FRA",
    "callingCode": "+33",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "French Guiana",
    "iso2": "GF",
    "iso3": "GUF",
    "callingCode": "+594",
    "defaultCurrency": "EUR",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "French Polynesia",
    "iso2": "PF",
    "iso3": "PYF",
    "callingCode": "+689",
    "defaultCurrency": "XPF",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "French Southern and Antarctic Lands",
    "iso2": "TF",
    "iso3": "ATF",
    "callingCode": "+262",
    "defaultCurrency": "EUR",
    "region": "Antarctic",
    "vatRegion": "Antarctic",
    "vatType": "Indirect tax"
  },
  {
    "name": "Gabon",
    "iso2": "GA",
    "iso3": "GAB",
    "callingCode": "+241",
    "defaultCurrency": "XAF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Gambia",
    "iso2": "GM",
    "iso3": "GMB",
    "callingCode": "+220",
    "defaultCurrency": "GMD",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Georgia",
    "iso2": "GE",
    "iso3": "GEO",
    "callingCode": "+995",
    "defaultCurrency": "GEL",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Germany",
    "iso2": "DE",
    "iso3": "DEU",
    "callingCode": "+49",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Ghana",
    "iso2": "GH",
    "iso3": "GHA",
    "callingCode": "+233",
    "defaultCurrency": "GHS",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Gibraltar",
    "iso2": "GI",
    "iso3": "GIB",
    "callingCode": "+350",
    "defaultCurrency": "GIP",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Greece",
    "iso2": "GR",
    "iso3": "GRC",
    "callingCode": "+30",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Greenland",
    "iso2": "GL",
    "iso3": "GRL",
    "callingCode": "+299",
    "defaultCurrency": "DKK",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Grenada",
    "iso2": "GD",
    "iso3": "GRD",
    "callingCode": "+1473",
    "defaultCurrency": "XCD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Guadeloupe",
    "iso2": "GP",
    "iso3": "GLP",
    "callingCode": "+590",
    "defaultCurrency": "EUR",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Guam",
    "iso2": "GU",
    "iso3": "GUM",
    "callingCode": "+1671",
    "defaultCurrency": "USD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Guatemala",
    "iso2": "GT",
    "iso3": "GTM",
    "callingCode": "+502",
    "defaultCurrency": "GTQ",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Guernsey",
    "iso2": "GG",
    "iso3": "GGY",
    "callingCode": "+44",
    "defaultCurrency": "GBP",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Guinea",
    "iso2": "GN",
    "iso3": "GIN",
    "callingCode": "+224",
    "defaultCurrency": "GNF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Guinea-Bissau",
    "iso2": "GW",
    "iso3": "GNB",
    "callingCode": "+245",
    "defaultCurrency": "XOF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Guyana",
    "iso2": "GY",
    "iso3": "GUY",
    "callingCode": "+592",
    "defaultCurrency": "GYD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Haiti",
    "iso2": "HT",
    "iso3": "HTI",
    "callingCode": "+509",
    "defaultCurrency": "HTG",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Heard Island and McDonald Islands",
    "iso2": "HM",
    "iso3": "HMD",
    "callingCode": "",
    "defaultCurrency": "USD",
    "region": "Antarctic",
    "vatRegion": "Antarctic",
    "vatType": "Indirect tax"
  },
  {
    "name": "Honduras",
    "iso2": "HN",
    "iso3": "HND",
    "callingCode": "+504",
    "defaultCurrency": "HNL",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Hong Kong",
    "iso2": "HK",
    "iso3": "HKG",
    "callingCode": "+852",
    "defaultCurrency": "HKD",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Hungary",
    "iso2": "HU",
    "iso3": "HUN",
    "callingCode": "+36",
    "defaultCurrency": "HUF",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Iceland",
    "iso2": "IS",
    "iso3": "ISL",
    "callingCode": "+354",
    "defaultCurrency": "ISK",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "India",
    "iso2": "IN",
    "iso3": "IND",
    "callingCode": "+91",
    "defaultCurrency": "INR",
    "region": "Asia",
    "vatRegion": "India",
    "vatType": "GST"
  },
  {
    "name": "Indonesia",
    "iso2": "ID",
    "iso3": "IDN",
    "callingCode": "+62",
    "defaultCurrency": "IDR",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Iran",
    "iso2": "IR",
    "iso3": "IRN",
    "callingCode": "+98",
    "defaultCurrency": "IRR",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Iraq",
    "iso2": "IQ",
    "iso3": "IRQ",
    "callingCode": "+964",
    "defaultCurrency": "IQD",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Ireland",
    "iso2": "IE",
    "iso3": "IRL",
    "callingCode": "+353",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Isle of Man",
    "iso2": "IM",
    "iso3": "IMN",
    "callingCode": "+44",
    "defaultCurrency": "GBP",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Israel",
    "iso2": "IL",
    "iso3": "ISR",
    "callingCode": "+972",
    "defaultCurrency": "ILS",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Italy",
    "iso2": "IT",
    "iso3": "ITA",
    "callingCode": "+39",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Ivory Coast",
    "iso2": "CI",
    "iso3": "CIV",
    "callingCode": "+225",
    "defaultCurrency": "XOF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Jamaica",
    "iso2": "JM",
    "iso3": "JAM",
    "callingCode": "+1876",
    "defaultCurrency": "JMD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Japan",
    "iso2": "JP",
    "iso3": "JPN",
    "callingCode": "+81",
    "defaultCurrency": "JPY",
    "region": "Asia",
    "vatRegion": "Japan",
    "vatType": "Consumption tax"
  },
  {
    "name": "Jersey",
    "iso2": "JE",
    "iso3": "JEY",
    "callingCode": "+44",
    "defaultCurrency": "GBP",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Jordan",
    "iso2": "JO",
    "iso3": "JOR",
    "callingCode": "+962",
    "defaultCurrency": "JOD",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Kazakhstan",
    "iso2": "KZ",
    "iso3": "KAZ",
    "callingCode": "+7",
    "defaultCurrency": "KZT",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Kenya",
    "iso2": "KE",
    "iso3": "KEN",
    "callingCode": "+254",
    "defaultCurrency": "KES",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Kiribati",
    "iso2": "KI",
    "iso3": "KIR",
    "callingCode": "+686",
    "defaultCurrency": "AUD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Kosovo",
    "iso2": "XK",
    "iso3": "UNK",
    "callingCode": "+383",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Kuwait",
    "iso2": "KW",
    "iso3": "KWT",
    "callingCode": "+965",
    "defaultCurrency": "KWD",
    "region": "Asia",
    "vatRegion": "GCC",
    "vatType": "VAT"
  },
  {
    "name": "Kyrgyzstan",
    "iso2": "KG",
    "iso3": "KGZ",
    "callingCode": "+996",
    "defaultCurrency": "KGS",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Laos",
    "iso2": "LA",
    "iso3": "LAO",
    "callingCode": "+856",
    "defaultCurrency": "LAK",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Latvia",
    "iso2": "LV",
    "iso3": "LVA",
    "callingCode": "+371",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Lebanon",
    "iso2": "LB",
    "iso3": "LBN",
    "callingCode": "+961",
    "defaultCurrency": "LBP",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Lesotho",
    "iso2": "LS",
    "iso3": "LSO",
    "callingCode": "+266",
    "defaultCurrency": "LSL",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Liberia",
    "iso2": "LR",
    "iso3": "LBR",
    "callingCode": "+231",
    "defaultCurrency": "LRD",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Libya",
    "iso2": "LY",
    "iso3": "LBY",
    "callingCode": "+218",
    "defaultCurrency": "LYD",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Liechtenstein",
    "iso2": "LI",
    "iso3": "LIE",
    "callingCode": "+423",
    "defaultCurrency": "CHF",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Lithuania",
    "iso2": "LT",
    "iso3": "LTU",
    "callingCode": "+370",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Luxembourg",
    "iso2": "LU",
    "iso3": "LUX",
    "callingCode": "+352",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Macau",
    "iso2": "MO",
    "iso3": "MAC",
    "callingCode": "+853",
    "defaultCurrency": "MOP",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Madagascar",
    "iso2": "MG",
    "iso3": "MDG",
    "callingCode": "+261",
    "defaultCurrency": "MGA",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Malawi",
    "iso2": "MW",
    "iso3": "MWI",
    "callingCode": "+265",
    "defaultCurrency": "MWK",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Malaysia",
    "iso2": "MY",
    "iso3": "MYS",
    "callingCode": "+60",
    "defaultCurrency": "MYR",
    "region": "Asia",
    "vatRegion": "Malaysia",
    "vatType": "SST"
  },
  {
    "name": "Maldives",
    "iso2": "MV",
    "iso3": "MDV",
    "callingCode": "+960",
    "defaultCurrency": "MVR",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Mali",
    "iso2": "ML",
    "iso3": "MLI",
    "callingCode": "+223",
    "defaultCurrency": "XOF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Malta",
    "iso2": "MT",
    "iso3": "MLT",
    "callingCode": "+356",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Marshall Islands",
    "iso2": "MH",
    "iso3": "MHL",
    "callingCode": "+692",
    "defaultCurrency": "USD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Martinique",
    "iso2": "MQ",
    "iso3": "MTQ",
    "callingCode": "+596",
    "defaultCurrency": "EUR",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Mauritania",
    "iso2": "MR",
    "iso3": "MRT",
    "callingCode": "+222",
    "defaultCurrency": "MRU",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Mauritius",
    "iso2": "MU",
    "iso3": "MUS",
    "callingCode": "+230",
    "defaultCurrency": "MUR",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Mayotte",
    "iso2": "YT",
    "iso3": "MYT",
    "callingCode": "+262",
    "defaultCurrency": "EUR",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Mexico",
    "iso2": "MX",
    "iso3": "MEX",
    "callingCode": "+52",
    "defaultCurrency": "MXN",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Micronesia",
    "iso2": "FM",
    "iso3": "FSM",
    "callingCode": "+691",
    "defaultCurrency": "USD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Moldova",
    "iso2": "MD",
    "iso3": "MDA",
    "callingCode": "+373",
    "defaultCurrency": "MDL",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Monaco",
    "iso2": "MC",
    "iso3": "MCO",
    "callingCode": "+377",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Mongolia",
    "iso2": "MN",
    "iso3": "MNG",
    "callingCode": "+976",
    "defaultCurrency": "MNT",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Montenegro",
    "iso2": "ME",
    "iso3": "MNE",
    "callingCode": "+382",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Montserrat",
    "iso2": "MS",
    "iso3": "MSR",
    "callingCode": "+1664",
    "defaultCurrency": "XCD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Morocco",
    "iso2": "MA",
    "iso3": "MAR",
    "callingCode": "+212",
    "defaultCurrency": "MAD",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Mozambique",
    "iso2": "MZ",
    "iso3": "MOZ",
    "callingCode": "+258",
    "defaultCurrency": "MZN",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Myanmar",
    "iso2": "MM",
    "iso3": "MMR",
    "callingCode": "+95",
    "defaultCurrency": "MMK",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Namibia",
    "iso2": "NA",
    "iso3": "NAM",
    "callingCode": "+264",
    "defaultCurrency": "NAD",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Nauru",
    "iso2": "NR",
    "iso3": "NRU",
    "callingCode": "+674",
    "defaultCurrency": "AUD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Nepal",
    "iso2": "NP",
    "iso3": "NPL",
    "callingCode": "+977",
    "defaultCurrency": "NPR",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Netherlands",
    "iso2": "NL",
    "iso3": "NLD",
    "callingCode": "+31",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "New Caledonia",
    "iso2": "NC",
    "iso3": "NCL",
    "callingCode": "+687",
    "defaultCurrency": "XPF",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "New Zealand",
    "iso2": "NZ",
    "iso3": "NZL",
    "callingCode": "+64",
    "defaultCurrency": "NZD",
    "region": "Oceania",
    "vatRegion": "New Zealand",
    "vatType": "GST"
  },
  {
    "name": "Nicaragua",
    "iso2": "NI",
    "iso3": "NIC",
    "callingCode": "+505",
    "defaultCurrency": "NIO",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Niger",
    "iso2": "NE",
    "iso3": "NER",
    "callingCode": "+227",
    "defaultCurrency": "XOF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Nigeria",
    "iso2": "NG",
    "iso3": "NGA",
    "callingCode": "+234",
    "defaultCurrency": "NGN",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Niue",
    "iso2": "NU",
    "iso3": "NIU",
    "callingCode": "+683",
    "defaultCurrency": "NZD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Norfolk Island",
    "iso2": "NF",
    "iso3": "NFK",
    "callingCode": "+672",
    "defaultCurrency": "AUD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "North Korea",
    "iso2": "KP",
    "iso3": "PRK",
    "callingCode": "+850",
    "defaultCurrency": "KPW",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "North Macedonia",
    "iso2": "MK",
    "iso3": "MKD",
    "callingCode": "+389",
    "defaultCurrency": "MKD",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Northern Mariana Islands",
    "iso2": "MP",
    "iso3": "MNP",
    "callingCode": "+1670",
    "defaultCurrency": "USD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Norway",
    "iso2": "NO",
    "iso3": "NOR",
    "callingCode": "+47",
    "defaultCurrency": "NOK",
    "region": "Europe",
    "vatRegion": "Norway",
    "vatType": "VAT"
  },
  {
    "name": "Oman",
    "iso2": "OM",
    "iso3": "OMN",
    "callingCode": "+968",
    "defaultCurrency": "OMR",
    "region": "Asia",
    "vatRegion": "GCC",
    "vatType": "VAT"
  },
  {
    "name": "Pakistan",
    "iso2": "PK",
    "iso3": "PAK",
    "callingCode": "+92",
    "defaultCurrency": "PKR",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Palau",
    "iso2": "PW",
    "iso3": "PLW",
    "callingCode": "+680",
    "defaultCurrency": "USD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Palestine",
    "iso2": "PS",
    "iso3": "PSE",
    "callingCode": "+970",
    "defaultCurrency": "EGP",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Panama",
    "iso2": "PA",
    "iso3": "PAN",
    "callingCode": "+507",
    "defaultCurrency": "PAB",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Papua New Guinea",
    "iso2": "PG",
    "iso3": "PNG",
    "callingCode": "+675",
    "defaultCurrency": "PGK",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Paraguay",
    "iso2": "PY",
    "iso3": "PRY",
    "callingCode": "+595",
    "defaultCurrency": "PYG",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Peru",
    "iso2": "PE",
    "iso3": "PER",
    "callingCode": "+51",
    "defaultCurrency": "PEN",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Philippines",
    "iso2": "PH",
    "iso3": "PHL",
    "callingCode": "+63",
    "defaultCurrency": "PHP",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Pitcairn Islands",
    "iso2": "PN",
    "iso3": "PCN",
    "callingCode": "+64",
    "defaultCurrency": "NZD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Poland",
    "iso2": "PL",
    "iso3": "POL",
    "callingCode": "+48",
    "defaultCurrency": "PLN",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Portugal",
    "iso2": "PT",
    "iso3": "PRT",
    "callingCode": "+351",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Puerto Rico",
    "iso2": "PR",
    "iso3": "PRI",
    "callingCode": "+1787",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Qatar",
    "iso2": "QA",
    "iso3": "QAT",
    "callingCode": "+974",
    "defaultCurrency": "QAR",
    "region": "Asia",
    "vatRegion": "GCC",
    "vatType": "VAT"
  },
  {
    "name": "Réunion",
    "iso2": "RE",
    "iso3": "REU",
    "callingCode": "+262",
    "defaultCurrency": "EUR",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Romania",
    "iso2": "RO",
    "iso3": "ROU",
    "callingCode": "+40",
    "defaultCurrency": "RON",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Russia",
    "iso2": "RU",
    "iso3": "RUS",
    "callingCode": "+7",
    "defaultCurrency": "RUB",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Rwanda",
    "iso2": "RW",
    "iso3": "RWA",
    "callingCode": "+250",
    "defaultCurrency": "RWF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Saint Barthélemy",
    "iso2": "BL",
    "iso3": "BLM",
    "callingCode": "+590",
    "defaultCurrency": "EUR",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Saint Helena, Ascension and Tristan da Cunha",
    "iso2": "SH",
    "iso3": "SHN",
    "callingCode": "+290",
    "defaultCurrency": "GBP",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Saint Kitts and Nevis",
    "iso2": "KN",
    "iso3": "KNA",
    "callingCode": "+1869",
    "defaultCurrency": "XCD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Saint Lucia",
    "iso2": "LC",
    "iso3": "LCA",
    "callingCode": "+1758",
    "defaultCurrency": "XCD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Saint Martin",
    "iso2": "MF",
    "iso3": "MAF",
    "callingCode": "+590",
    "defaultCurrency": "EUR",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Saint Pierre and Miquelon",
    "iso2": "PM",
    "iso3": "SPM",
    "callingCode": "+508",
    "defaultCurrency": "EUR",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "iso2": "VC",
    "iso3": "VCT",
    "callingCode": "+1784",
    "defaultCurrency": "XCD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Samoa",
    "iso2": "WS",
    "iso3": "WSM",
    "callingCode": "+685",
    "defaultCurrency": "WST",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "San Marino",
    "iso2": "SM",
    "iso3": "SMR",
    "callingCode": "+378",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "São Tomé and Príncipe",
    "iso2": "ST",
    "iso3": "STP",
    "callingCode": "+239",
    "defaultCurrency": "STN",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Saudi Arabia",
    "iso2": "SA",
    "iso3": "SAU",
    "callingCode": "+966",
    "defaultCurrency": "SAR",
    "region": "Asia",
    "vatRegion": "GCC",
    "vatType": "VAT"
  },
  {
    "name": "Senegal",
    "iso2": "SN",
    "iso3": "SEN",
    "callingCode": "+221",
    "defaultCurrency": "XOF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Serbia",
    "iso2": "RS",
    "iso3": "SRB",
    "callingCode": "+381",
    "defaultCurrency": "RSD",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Seychelles",
    "iso2": "SC",
    "iso3": "SYC",
    "callingCode": "+248",
    "defaultCurrency": "SCR",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Sierra Leone",
    "iso2": "SL",
    "iso3": "SLE",
    "callingCode": "+232",
    "defaultCurrency": "SLL",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Singapore",
    "iso2": "SG",
    "iso3": "SGP",
    "callingCode": "+65",
    "defaultCurrency": "SGD",
    "region": "Asia",
    "vatRegion": "Singapore",
    "vatType": "GST"
  },
  {
    "name": "Sint Maarten",
    "iso2": "SX",
    "iso3": "SXM",
    "callingCode": "+1721",
    "defaultCurrency": "ANG",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Slovakia",
    "iso2": "SK",
    "iso3": "SVK",
    "callingCode": "+421",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Slovenia",
    "iso2": "SI",
    "iso3": "SVN",
    "callingCode": "+386",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Solomon Islands",
    "iso2": "SB",
    "iso3": "SLB",
    "callingCode": "+677",
    "defaultCurrency": "SBD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Somalia",
    "iso2": "SO",
    "iso3": "SOM",
    "callingCode": "+252",
    "defaultCurrency": "SOS",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "South Africa",
    "iso2": "ZA",
    "iso3": "ZAF",
    "callingCode": "+27",
    "defaultCurrency": "ZAR",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "South Georgia",
    "iso2": "GS",
    "iso3": "SGS",
    "callingCode": "+500",
    "defaultCurrency": "SHP",
    "region": "Antarctic",
    "vatRegion": "Antarctic",
    "vatType": "Indirect tax"
  },
  {
    "name": "South Korea",
    "iso2": "KR",
    "iso3": "KOR",
    "callingCode": "+82",
    "defaultCurrency": "KRW",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "South Sudan",
    "iso2": "SS",
    "iso3": "SSD",
    "callingCode": "+211",
    "defaultCurrency": "SSP",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Spain",
    "iso2": "ES",
    "iso3": "ESP",
    "callingCode": "+34",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Sri Lanka",
    "iso2": "LK",
    "iso3": "LKA",
    "callingCode": "+94",
    "defaultCurrency": "LKR",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Sudan",
    "iso2": "SD",
    "iso3": "SDN",
    "callingCode": "+249",
    "defaultCurrency": "SDG",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Suriname",
    "iso2": "SR",
    "iso3": "SUR",
    "callingCode": "+597",
    "defaultCurrency": "SRD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Svalbard and Jan Mayen",
    "iso2": "SJ",
    "iso3": "SJM",
    "callingCode": "+4779",
    "defaultCurrency": "NOK",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Sweden",
    "iso2": "SE",
    "iso3": "SWE",
    "callingCode": "+46",
    "defaultCurrency": "SEK",
    "region": "Europe",
    "vatRegion": "EU",
    "vatType": "VAT"
  },
  {
    "name": "Switzerland",
    "iso2": "CH",
    "iso3": "CHE",
    "callingCode": "+41",
    "defaultCurrency": "CHF",
    "region": "Europe",
    "vatRegion": "Switzerland",
    "vatType": "VAT"
  },
  {
    "name": "Syria",
    "iso2": "SY",
    "iso3": "SYR",
    "callingCode": "+963",
    "defaultCurrency": "SYP",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Taiwan",
    "iso2": "TW",
    "iso3": "TWN",
    "callingCode": "+886",
    "defaultCurrency": "TWD",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Tajikistan",
    "iso2": "TJ",
    "iso3": "TJK",
    "callingCode": "+992",
    "defaultCurrency": "TJS",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Tanzania",
    "iso2": "TZ",
    "iso3": "TZA",
    "callingCode": "+255",
    "defaultCurrency": "TZS",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Thailand",
    "iso2": "TH",
    "iso3": "THA",
    "callingCode": "+66",
    "defaultCurrency": "THB",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Timor-Leste",
    "iso2": "TL",
    "iso3": "TLS",
    "callingCode": "+670",
    "defaultCurrency": "USD",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Togo",
    "iso2": "TG",
    "iso3": "TGO",
    "callingCode": "+228",
    "defaultCurrency": "XOF",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Tokelau",
    "iso2": "TK",
    "iso3": "TKL",
    "callingCode": "+690",
    "defaultCurrency": "NZD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Tonga",
    "iso2": "TO",
    "iso3": "TON",
    "callingCode": "+676",
    "defaultCurrency": "TOP",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Trinidad and Tobago",
    "iso2": "TT",
    "iso3": "TTO",
    "callingCode": "+1868",
    "defaultCurrency": "TTD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Tunisia",
    "iso2": "TN",
    "iso3": "TUN",
    "callingCode": "+216",
    "defaultCurrency": "TND",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Türkiye",
    "iso2": "TR",
    "iso3": "TUR",
    "callingCode": "+90",
    "defaultCurrency": "TRY",
    "region": "Asia",
    "vatRegion": "Turkiye",
    "vatType": "VAT"
  },
  {
    "name": "Turkmenistan",
    "iso2": "TM",
    "iso3": "TKM",
    "callingCode": "+993",
    "defaultCurrency": "TMT",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Turks and Caicos Islands",
    "iso2": "TC",
    "iso3": "TCA",
    "callingCode": "+1649",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Tuvalu",
    "iso2": "TV",
    "iso3": "TUV",
    "callingCode": "+688",
    "defaultCurrency": "AUD",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Uganda",
    "iso2": "UG",
    "iso3": "UGA",
    "callingCode": "+256",
    "defaultCurrency": "UGX",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Ukraine",
    "iso2": "UA",
    "iso3": "UKR",
    "callingCode": "+380",
    "defaultCurrency": "UAH",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "United Arab Emirates",
    "iso2": "AE",
    "iso3": "ARE",
    "callingCode": "+971",
    "defaultCurrency": "AED",
    "region": "Asia",
    "vatRegion": "GCC",
    "vatType": "VAT"
  },
  {
    "name": "United Kingdom",
    "iso2": "GB",
    "iso3": "GBR",
    "callingCode": "+44",
    "defaultCurrency": "GBP",
    "region": "Europe",
    "vatRegion": "United Kingdom",
    "vatType": "VAT"
  },
  {
    "name": "United States",
    "iso2": "US",
    "iso3": "USA",
    "callingCode": "+1",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "United States",
    "vatType": "Sales tax"
  },
  {
    "name": "United States Minor Outlying Islands",
    "iso2": "UM",
    "iso3": "UMI",
    "callingCode": "+268",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "United States Virgin Islands",
    "iso2": "VI",
    "iso3": "VIR",
    "callingCode": "+1340",
    "defaultCurrency": "USD",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Uruguay",
    "iso2": "UY",
    "iso3": "URY",
    "callingCode": "+598",
    "defaultCurrency": "UYU",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Uzbekistan",
    "iso2": "UZ",
    "iso3": "UZB",
    "callingCode": "+998",
    "defaultCurrency": "UZS",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Vanuatu",
    "iso2": "VU",
    "iso3": "VUT",
    "callingCode": "+678",
    "defaultCurrency": "VUV",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Vatican City",
    "iso2": "VA",
    "iso3": "VAT",
    "callingCode": "+3906698",
    "defaultCurrency": "EUR",
    "region": "Europe",
    "vatRegion": "Europe",
    "vatType": "Indirect tax"
  },
  {
    "name": "Venezuela",
    "iso2": "VE",
    "iso3": "VEN",
    "callingCode": "+58",
    "defaultCurrency": "VES",
    "region": "Americas",
    "vatRegion": "Americas",
    "vatType": "Indirect tax"
  },
  {
    "name": "Vietnam",
    "iso2": "VN",
    "iso3": "VNM",
    "callingCode": "+84",
    "defaultCurrency": "VND",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Wallis and Futuna",
    "iso2": "WF",
    "iso3": "WLF",
    "callingCode": "+681",
    "defaultCurrency": "XPF",
    "region": "Oceania",
    "vatRegion": "Oceania",
    "vatType": "Indirect tax"
  },
  {
    "name": "Western Sahara",
    "iso2": "EH",
    "iso3": "ESH",
    "callingCode": "+2125288",
    "defaultCurrency": "DZD",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Yemen",
    "iso2": "YE",
    "iso3": "YEM",
    "callingCode": "+967",
    "defaultCurrency": "YER",
    "region": "Asia",
    "vatRegion": "Asia",
    "vatType": "Indirect tax"
  },
  {
    "name": "Zambia",
    "iso2": "ZM",
    "iso3": "ZMB",
    "callingCode": "+260",
    "defaultCurrency": "ZMW",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  },
  {
    "name": "Zimbabwe",
    "iso2": "ZW",
    "iso3": "ZWE",
    "callingCode": "+263",
    "defaultCurrency": "BWP",
    "region": "Africa",
    "vatRegion": "Africa",
    "vatType": "Indirect tax"
  }
] as const satisfies readonly Country[];

export type CountryIso2 = (typeof COUNTRIES)[number]['iso2'];

export const DEFAULT_COUNTRY = COUNTRIES.find((country) => country.iso2 === 'US') ?? COUNTRIES[0];

export function countryOptionLabel(country: Country) {
  return country.callingCode ? `${country.name} (${country.callingCode})` : country.name;
}

export function findCountryByIso2(iso2: string | undefined | null) {
  if (!iso2) return undefined;
  return COUNTRIES.find((country) => country.iso2.toLowerCase() === iso2.toLowerCase());
}

export function findCountryByName(name: string | undefined | null) {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return COUNTRIES.find((country) => country.name.toLowerCase() === normalized);
}

export function findCountryByCallingCode(callingCode: string | undefined | null, countryName?: string) {
  if (countryName) {
    const countryMatch = COUNTRIES.find((country) => country.name === countryName && country.callingCode === callingCode);
    if (countryMatch) return countryMatch;
  }
  if (!callingCode) return undefined;
  return COUNTRIES.find((country) => country.callingCode === callingCode);
}

export function resolveCountry(value: unknown) {
  if (!value) return undefined;
  if (typeof value === 'object' && value !== null && 'iso2' in value) {
    return findCountryByIso2(String((value as Country).iso2));
  }
  const text = String(value);
  return findCountryByIso2(text) ?? findCountryByName(text);
}

