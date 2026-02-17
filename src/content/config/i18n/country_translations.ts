const countryTranslations = {
en: {}, gb: {},
cs: {
"AF": "Afghánistán", "AX": "Ålandy", "AL": "Albánie", "DZ": "Alžírsko", "AS": "Americká Samoa", 
"AD": "Andorra", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarktida", "AG": "Antigua a Barbuda", 
"AR": "Argentina", "AM": "Arménie", "AW": "Aruba", "AU": "Austrálie", "AT": "Rakousko", 
"AZ": "Ázerbájdžán", "BS": "Bahamy", "BH": "Bahrajn", "BD": "Bangladéš", "BB": "Barbados", 
"BY": "Bělorusko", "BE": "Belgie", "BZ": "Belize", "BJ": "Benin", "BM": "Bermudy", 
"BT": "Bhútán", "BO": "Bolívie", "BA": "Bosna a Hercegovina", "BW": "Botswana", "BR": "Brazílie", 
"VG": "Britské Panenské ostrovy", "BN": "Brunej", "BG": "Bulharsko", "BF": "Burkina Faso", "BI": "Burundi", 
"KH": "Kambodža", "CM": "Kamerun", "CA": "Kanada", "CV": "Kapverdy", "KY": "Kajmanské ostrovy", 
"CF": "Středoafrická republika", "TD": "Čad", "CL": "Chile", "CN": "Čína", "CX": "Vánoční ostrov", 
"CO": "Kolumbie", "KM": "Komory", "CG": "Kongo", "CD": "Kongo (DRK)", "CK": "Cookovy ostrovy", 
"CR": "Kostarika", "CI": "Pobřeží slonoviny", "HR": "Chorvatsko", "CU": "Kuba", "CY": "Kypr", 
"CZ": "Česko", "DK": "Dánsko", "DJ": "Džibutsko", "DM": "Dominika", "DO": "Dominikánská republika", 
"EC": "Ekvádor", "EG": "Egypt", "SV": "Salvador", "GQ": "Rovníková Guinea", "ER": "Eritrea", 
"EE": "Estonsko", "ET": "Etiopie", "FK": "Falklandy", "FO": "Faerské ostrovy", "FJ": "Fidži", 
"FI": "Finsko", "FR": "Francie", "GF": "Francouzská Guyana", "PF": "Francouzská Polynésie", "GA": "Gabon", 
"GM": "Gambie", "GE": "Gruzie", "DE": "Německo", "GH": "Ghana", "GI": "Gibraltar", 
"GR": "Řecko", "GL": "Grónsko", "GD": "Grenada", "GP": "Guadeloupe", "GU": "Guam", 
"GT": "Guatemala", "GG": "Guernsey", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana", 
"HT": "Haiti", "VA": "Vatikán", "HN": "Honduras", "HK": "Hongkong", "HU": "Maďarsko", 
"IS": "Island", "IN": "Indie", "ID": "Indonésie", "IR": "Írán", "IQ": "Irák", 
"IE": "Irsko", "IM": "Ostrov Man", "IL": "Izrael", "IT": "Itálie", "JM": "Jamajka", 
"JP": "Japonsko", "JE": "Jersey", "JO": "Jordánsko", "KZ": "Kazachstán", "KE": "Keňa", 
"KI": "Kiribati", "KP": "Severní Korea", "KR": "Jižní Korea", "KW": "Kuvajt", "KG": "Kyrgyzstán", 
"LA": "Laos", "LV": "Lotyšsko", "LB": "Libanon", "LS": "Lesotho", "LR": "Libérie", 
"LY": "Libye", "LI": "Lichtenštejnsko", "LT": "Litva", "LU": "Lucembursko", "MO": "Macao", 
"MK": "Severní Makedonie", "MG": "Madagaskar", "MW": "Malawi", "MY": "Malajsie", "MV": "Maledivy", 
"ML": "Mali", "MT": "Malta", "MH": "Marshallovy ostrovy", "MQ": "Martinik", "MR": "Mauritánie", 
"MU": "Mauricius", "YT": "Mayotte", "MX": "Mexiko", "FM": "Mikronésie", "MD": "Moldavsko", 
"MC": "Monako", "MN": "Mongolsko", "ME": "Černá Hora", "MS": "Montserrat", "MA": "Maroko", 
"MZ": "Mosambik", "MM": "Myanmar", "NA": "Namibie", "NR": "Nauru", "NP": "Nepál", 
"NL": "Nizozemsko", "NC": "Nová Kaledonie", "NZ": "Nový Zéland", "NI": "Nikaragua", "NE": "Niger", 
"NG": "Nigérie", "NU": "Niue", "NF": "Norfolk", "MP": "Severní Mariany", "NO": "Norsko", 
"OM": "Omán", "PK": "Pákistán", "PW": "Palau", "PS": "Palestina", "PA": "Panama", 
"PG": "Papua-Nová Guinea", "PY": "Paraguay", "PE": "Peru", "PH": "Filipíny", "PN": "Pitcairnovy ostrovy", 
"PL": "Polsko", "PT": "Portugalsko", "PR": "Portoriko", "QA": "Katar", "RE": "Réunion", 
"RO": "Rumunsko", "RU": "Rusko", "RW": "Rwanda", "KN": "Svatý Kryštof a Nevis", "LC": "Svatá Lucie", 
"PM": "Saint-Pierre a Miquelon", "VC": "Svatý Vincenc a Grenadiny", "WS": "Samoa", "SM": "San Marino", "ST": "Svatý Tomáš a Princův ostrov", 
"SA": "Saúdská Arábie", "SN": "Senegal", "RS": "Srbsko", "SC": "Seychely", "SL": "Sierra Leone", 
"SG": "Singapur", "SK": "Slovensko", "SI": "Slovinsko", "SB": "Šalomounovy ostrovy", "SO": "Somálsko", 
"ZA": "Jihoafrická republika", "GS": "Jižní Georgie a Jižní Sandwichovy ostrovy", "ES": "Španělsko", "LK": "Šrí Lanka", "SD": "Súdán", 
"SR": "Surinam", "SJ": "Špicberky a Jan Mayen", "SZ": "Svazijsko", "SE": "Švédsko", "CH": "Švýcarsko", 
"SY": "Sýrie", "TW": "Tchaj-wan", "TJ": "Tádžikistán", "TZ": "Tanzanie", "TH": "Thajsko", 
"TL": "Východní Timor", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trinidad a Tobago", 
"TN": "Tunisko", "TR": "Turecko", "TM": "Turkmenistán", "TC": "Turks a Caicos", "TV": "Tuvalu", 
"UG": "Uganda", "UA": "Ukrajina", "AE": "Spojené arabské emiráty", "GB": "Velká Británie", "US": "USA", 
"UY": "Uruguay", "UZ": "Uzbekistán", "VU": "Vanuatu", "VE": "Venezuela", "VN": "Vietnam", 
"WF": "Wallis a Futuna", "EH": "Západní Sahara", "YE": "Jemen", "ZM": "Zambie", "ZW": "Zimbabwe"
}, sk: { 
"AF": "Afganistan", "AX": "Ålandy", "AL": "Albánsko", "DZ": "Alžírsko", "AS": "Americká Samoa", 
"AD": "Andorra", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarktída", "AG": "Antigua a Barbuda", 
"AR": "Argentína", "AM": "Arménsko", "AW": "Aruba", "AU": "Austrália", "AT": "Rakúsko", 
"AZ": "Azerbajdžan", "BS": "Bahamy", "BH": "Bahrajn", "BD": "Bangladéš", "BB": "Barbados", 
"BY": "Bielorusko", "BE": "Belgicko", "BZ": "Belice", "BJ": "Benin", "BM": "Bermudy", 
"BT": "Bhután", "BO": "Bolívia", "BA": "Bosna a Hercegovina", "BW": "Botswana", "BR": "Brazília", 
"VG": "Britské Panenské ostrovy", "BN": "Brunej", "BG": "Bulharsko", "BF": "Burkina Faso", "BI": "Burundi", 
"KH": "Kambodža", "CM": "Kamerún", "CA": "Kanada", "CV": "Kapverdy", "KY": "Kajmanie ostrovy", 
"CF": "Stredoafrická republika", "TD": "Čad", "CL": "Čile", "CN": "Čína", "CX": "Vianočný ostrov", 
"CO": "Kolumbia", "KM": "Komory", "CG": "Kongo", "CD": "Kongo (DRK)", "CK": "Cookove ostrovy", 
"CR": "Kostarika", "CI": "Pobrežie slonoviny", "HR": "Chorvátsko", "CU": "Kuba", "CY": "Cyprus", 
"CZ": "Česko", "DK": "Dánsko", "DJ": "Džibutsko", "DM": "Dominika", "DO": "Dominikánska republika", 
"EC": "Ekvádor", "EG": "Egypt", "SV": "Salvador", "GQ": "Rovníková Guinea", "ER": "Eritrea", 
"EE": "Estónsko", "ET": "Etiópia", "FK": "Falklandy", "FO": "Faerské ostrovy", "FJ": "Fidži", 
"FI": "Fínsko", "FR": "Francúzsko", "GF": "Francúzska Guyana", "PF": "Francúzska Polynézia","GA": "Gabon", 
"GM": "Gambia", "GE": "Gruzie", "DE": "Nemecko", "GH": "Ghana", "GI": "Gibraltár", 
"GR": "Grécko", "GL": "Grónsko", "GD": "Grenada", "GP": "Guadeloupe", "GU": "Guam", 
"GT": "Guatemala", "GG": "Guernsey", "GN": "Guinea", "GW": "Guinea-Bissau", "GY": "Guyana", 
"HT": "Haiti", "VA": "Vatikán", "HN": "Honduras", "HK": "Hongkong", "HU": "Maďarsko", 
"IS": "Island", "IN": "India", "ID": "Indonézia","IR": "Irán", "IQ": "Irak", 
"IE": "Írsko", "IM": "Ostrov Man", "IL": "Izrael", "IT": "Taliansko", "JM": "Jamajka", 
"JP": "Japonsko", "JE": "Jersey", "JO": "Jordánsko", "KZ": "Kazachstan", "KE": "Keňa", 
"KI": "Kiribati", "KP": "Severná Kórea", "KR": "Južná Kórea", "KW": "Kuvajt", "KG": "Kirgizsko", 
"LA": "Laos", "LV": "Lotyšsko", "LB": "Libanon", "LS": "Lesotho", "LR": "Libéria", 
"LY": "Líbya", "LI": "Lichtenštajnsko", "LT": "Litva", "LU": "Luxembursko", "MO": "Macao", 
"MK": "Severná Macedónsko", "MG": "Madagaskar", "MW": "Malawi", "MY": "Malajzia","MV": "Maledivy", 
"ML": "Mali", "MT": "Malta", "MH": "Marshallove ostrovy", "MQ": "Martinik", "MR": "Mauritánia", 
"MU": "Maurícius", "YT": "Mayotte", "MX": "Mexiko", "FM": "Mikronézia", "MD": "Moldavsko", 
"MC": "Monako", "MN": "Mongolsko", "ME": "Čierna Hora", "MS": "Montserrat", "MA": "Maroko", 
"MZ": "Mozambik", "MM": "Mjanmarsko", "NA": "Namíbia", "NR": "Nauru", "NP": "Nepál", 
"NL": "Holandsko", "NC": "Nová Kaledónia", "NZ": "Nový Zéland", "NI": "Nikaragua", "NIE": "Niger", 
"NG": "Nigéria", "NU": "Niue", "NF": "Norfolk", "MP": "Severné Mariany", "NO": "Nórsko", 
"OM": "Omán", "PK": "Pakistan", "PW": "Palau", "PS": "Palestína", "PA": "Panama", 
"PG": "Papua-Nová Guinea", "PY": "Paraguaj", "PE": "Peru", "PH": "Filipíny", "PN": "Pitcairnove ostrovy", 
"PL": "Poľsko", "PT": "Portugalsko", "PR": "Portoriko", "QA": "Katar", "RE": "Réunion", 
"RO": "Rumunsko", "RU": "Rusko", "RW": "Rwanda", "KN": "Svätý Krištof a Nevis", "LC": "Svätá Lucia", 
"PM": "Saint-Pierre a Miquelon", "VC": "Svätý Vincent a Grenadíny", "WS": "Samoa", "SM": "San Maríno", "ST": "Svätý Tomáš a Princov ostrov", 
"SA": "Saudská Arábia", "SN": "Senegal", "RS": "Srbsko", "SC": "Seychely", "SL": "Sierra Leone", 
"SG": "Singapur", "SK": "Slovensko", "SI": "Slovinsko", "SB": "Šalamúnove ostrovy", "SO": "Somálsko", 
"ZA": "Juhoafrická republika", "GS": "Južná Georgia a Južné Sandwichove ostrovy", "ES": "Španielsko", "LK": "Šrí Lanka", "SD": "Sudán", 
"SR": "Surinam", "SJ": "Špicbergy a Jan Mayen", "SZ": "Svazijsko", "SE": "Švédsko", "CH": "Švajčiarsko", 
"SY": "Sýria", "TW": "Tchaj-wan", "TJ": "Tádžikistan", "TZ": "Tanzania", "TH": "Thajsko", 
"TL": "Východný Timor", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trinidad a Tobago", 
"TN": "Tunisko", "TR": "Turecko", "TM": "Turkménsko", "TC": "Turks a Caicos", "TV": "Tuvalu", 
"UG": "Uganda", "UA": "Ukrajina", "AE": "Spojené arabské emiráty", "GB": "Veľká Británia", "US": "USA", 
"UY": "Uruguaj", "UZ": "Uzbekistan", "VU": "Vanuatu", "VO": "Venezuela", "VN": "Vietnam", 
"WF": "Wallis a Futuna", "EH": "Západná Sahara", "YE": "Jemen", "ZM": "Zambia", "ZW": "Zimbabwe" 
}, pl: {
"AF": "Afganistan", "AX": "Wyspy Alandzkie", "AL": "Albania", "DZ": "Algieria", "AS": "Samoa Amerykańskie",
"AD": "Andora", "AO": "Angola", "AI": "Anguilla", "AQ": "Antarktyda", "AG": "Antigua i Barbuda",
"AR": "Argentyna", "AM": "Armenia", "AW": "Aruba", "AU": "Australia", "AT": "Austria",
"AZ": "Azerbejdżan", "BS": "Bahamy", "BH": "Bahrajn", "BD": "Bangladesz", "BB": "Barbados",
"BY": "Białoruś", "BE": "Belgia", "BZ": "Belize", "BJ": "Benin", "BM": "Bermudy",
"BT": "Bhutan", "BO": "Boliwia", "BA": "Bośnia i Hercegowina", "BW": "Botswana", "BR": "Brazylia",
"VG": "Brytyjskie Wyspy Dziewicze", "BN": "Brunei", "BG": "Bułgaria", "BF": "Burkina Faso", "BI": "Burundi",
"KH": "Kambodża", "CM": "Kamerun", "CA": "Kanada", "CV": "Republika Zielonego Przylądka", "KY": "Kajmany",
"CF": "Republika Środkowoafrykańska", "TD": "Czad", "CL": "Chile", "CN": "Chiny", "CX": "Wyspa Bożego Narodzenia",
"CO": "Kolumbia", "KM": "Komory", "CG": "Kongo", "CD": "Kongo (DRK)", "CK": "Wyspy Cooka",
"CR": "Kostaryka", "CI": "Wybrzeże Kości Słoniowej", "HR": "Chorwacja", "CU": "Kuba", "CY": "Cypr",
"CZ": "Czechy", "DK": "Dania", "DJ": "Dżibuti", "DM": "Dominika", "DO": "Dominikana",
"EC": "Ekwador", "EG": "Egipt", "SV": "Salwador", "GQ": "Gwinea Równikowa", "ER": "Erytrea",
"EE": "Estonia", "ET": "Etiopia", "FK": "Falklandy", "FO": "Wyspy Owcze", "FJ": "Fidżi",
"FI": "Finlandia", "FR": "Francja", "GF": "Gujana Francuska", "PF": "Polinezja Francuska", "GA": "Gabon",
"GM": "Gambia", "GE": "Gruzja", "DE": "Niemcy", "GH": "Ghana", "GI": "Gibraltar",
"GR": "Grecja", "GL": "Grenlandia", "GD": "Grenada", "GP": "Gwadelupa", "GU": "Guam",
"GT": "Gwatemala", "GG": "Guernsey", "GN": "Gwinea", "GW": "Gwinea Bissau", "GY": "Gujana",
"HT": "Haiti", "VA": "Watykan", "HN": "Honduras", "HK": "Hongkong", "HU": "Węgry",
"IS": "Islandia", "IN": "Indie", "ID": "Indonezja", "IR": "Iran", "IQ": "Irak",
"IE": "Irlandia", "IM": "Wyspa Man", "IL": "Izrael", "IT": "Włochy", "JM": "Jamajka",
"JP": "Japonia", "JE": "Jersey", "JO": "Jordan", "KZ": "Kazachstan", "KE": "Kenia",
"KI": "Kiribati", "KP": "Korea Północna", "KR": "Korea Południowa", "KW": "Kuwejt", "KG": "Kirgistan",
"LA": "Laos", "LV": "Łotwa", "LB": "Liban", "LS": "Lesoto", "LR": "Liberia",
"LY": "Libia", "LI": "Liechtenstein", "LT": "Litwa", "LU": "Luksemburg", "MO": "Makau",
"MK": "Macedonia Północna", "MG": "Madagaskar", "MW": "Malawi", "MY": "Malezja", "MV": "Malediwy",
"ML": "Mali", "MT": "Malta", "MH": "Wyspy Marshalla", "MQ": "Martynika", "MR": "Mauretania",
"MU": "Mauritius", "YT": "Majotta", "MX": "Meksyk", "FM": "Mikronezja", "MD": "Mołdawia",
"MC": "Monako", "MN": "Mongolia", "ME": "Czarnogóra", "MS": "Montserrat", "MA": "Maroko",
"MZ": "Mozambik", "MM": "Birma", "NA": "Namibia", "NR": "Nauru", "NP": "Nepal",
"NL": "Holandia", "NC": "Nowa Kaledonia", "NZ": "Nowa Zelandia", "NI": "Nikaragua", "NE": "Niger",
"NG": "Nigeria", "NU": "Niue", "NF": "Norfolk", "MP": "Mariany Północne", "NO": "Norwegia",
"OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PS": "Palestyna", "PA": "Panama",
"PG": "Papua Nowa Gwinea", "PY": "Paragwaj", "PE": "Peru", "PH": "Filipiny", "PN": "Wyspy Pitcairn",
"PL": "Polska", "PT": "Portugalia", "PR": "Puerto Rico", "QA": "Katar", "RE": "Réunion",
"RO": "Rumunia", "RU": "Rosja", "RW": "Rwanda", "KN": "Saint Kitts i Nevis", "LC": "Saint Lucia",
"PM": "Saint-Pierre i Miquelon", "VC": "Saint Vincent i Grenadyny", "WS": "Samoa", "SM": "San Marino", "ST": "Wyspy Świętego Tomasza i Książęca",
"SA": "Arabia Saudyjska", "SN": "Senegal", "RS": "Serbia", "SC": "Seszele", "SL": "Sierra Leone",
"SG": "Singapur", "SK": "Słowacja", "SI": "Słowenia", "SB": "Wyspy Salomona", "SO": "Somalia",
"ZA": "Republika Południowej Afryki", "GS": "Georgia Południowa i Sandwich Południowy", "ES": "Hiszpania", "LK": "Sri Lanka", "SD": "Sudan",
"SR": "Surinam", "SJ": "Svalbard i Jan Mayen", "SZ": "Suazi", "SE": "Szwecja", "CH": "Szwajcaria",
"SY": "Syria", "TW": "Tajwan", "TJ": "Tadżykistan", "TZ": "Tanzania", "TH": "Tajlandia",
"TL": "Timor Wschodni", "TG": "Togo", "TK": "Tokelau", "TO": "Tonga", "TT": "Trynidad i Tobago",
"TN": "Tunezja", "TR": "Turcja", "TM": "Turkmenistan", "TC": "Turks i Caicos", "TV": "Tuvalu",
"UG": "Uganda", "UA": "Ukraina", "AE": "Zjednoczone Emiraty Arabskie", "GB": "Wielka Brytania", "USA": "USA",
"UY": "Urugwaj", "UZ": "Uzbekistan", "VU": "Vanuatu", "VE": "Wenezuela", "VN": "Wietnam",
"WF": "Wallis i Futuna", "EH": "Sahara Zachodnia", "YE": "Jemen", "ZM": "Zambia", "ZW": "Zimbabwe"
}, uk: {
"AF": "Афганістан", "AX": "Аландські острови", "AL": "Албанія", "DZ": "Алжир", "AS": "Американське Самоа",
"AD": "Андорра", "AO": "Ангола", "AI": "Ангілья", "AQ": "Антарктида", "AG": "Антигуа Барбуда",
"AR": "Аргентина", "AM": "Вірменія", "AW": "a", "AU": "Австралія", "AT": "Австрія",
"AZ": "Азербайджан", "BS": "Багами", "BH": "Бахрейн", "BD": "Бангладеш", "BB": "Барбадос",
"BY": "Білорусь", "BE": "Бельгія", "BZ": "Беліз", "BJ": "Бенін", "BM": "Бермудські острови",
"БТ": "Бутан", "BO": "Болівія", "BA": "Боснія Герцеговина", "BW": "Ботсвана", "BR": "Бразилія",
"VG": "Британські Віргінські острови", "BN": "Бруней", "BG": "Болгарія", "BF": "Буркіна-Фасо", "BI": "Бурунді",
"KH": "Камбоджа", "CM": "Камерун", "CA": "Канада", "CV": "КабВерде", "KY": "Кайманові острови",
"CF": "Центральноафриканська Республіка", "TD": "Чад", "CL": "Чилі", "CN": "Китай", "CX": "Острів Різдва",
"CO": "Колумбія", "KM": "Коморські острови", "CG": "Конго", "CD": "Конго (ДРК)", "CK": "Острови Кука",
"CR": "Коста-Рика", "CI": "Кот д'Івуар", "HR": "Хорватія", "CU": "", "CY": "Кіпр",
"CZ": "Чехія", "DK": "Данія", "DJ": "Джибуті", "DM": "Домініка", "DO": "Домініканська Республіка",
"EC": "Еквадор", "EG": "Єгипет", "SV": "Сальвадор", "GQ": "Екваторіальна Гвінея", "ER": "Еритрея",
"EE": "Естонія", "ET": "Ефіопія", "FK": "Фолклендські острови", "FO": "Фарерські острови", "FJ": "Фіджі",
"FI": "Фінляндія", "FR": "Франція", "GF": "Французька Гвіана", "PF": "Французька Полінезія", "GA": "Габон",
"GM": "Гамбія", "GE": "Грузія", "DE": "Німеччина", "GH": "Гана", "GI": "Гібралтар",
"GR": "Греція", "GL": "Гренландія", "GD": "Гренада", "GP": "Гваделупа", "GU": "Гуам",
"GT": "Гватемала", "GG": "Гернсі", "GN": "Гвінея", "GW": "Гвінея-Бісау", "GY": "Гаяна",
"HT": "Гаїті", "VA": "Ватикан", "HN": "Гондурас", "HK": "Гонконг", "HU": "Угорщина",
"IS": "Ісландія", "IN": "Індія", "ID": "Індонезія", "IR": "Іран", "IQ": "Ірак",
"IE": "Ірландія", "IM": "Острів Мен", "IL": "Ізраїль", "IT": "Італія", "JM": "Ямайка",
"JP": "Японія", "JE": "Джерсі", "JO": "Йорданія", "KZ": "Казахстан", "KE": "Кенія",
"KI": "Кірібаті", "KP": "Північна Корея", "KR": "Південна Корея", "KW": "Кувейт", "KG": "Киргизстан",
"LA": "Лаос", "LV": "Латвія", "LB": "Ліван", "LS": "Лесото", "LR": "Ліберія",
"LY": "Лівія", "LI": "Ліхтенштейн", "LT": "Литва", "LU": "Люксембург", "MO": "Макао",
"MK": "Північна Македонія", "MG": "Мадагаскар", "MW": "Малаві", "MY": "Малайзія", "MV": "Мальдіви",
"ML": "Малі", "MT": "Мальта", "MH": "Маршаллові острови", "MQ": "Мартиніка", "MR": "Мавританія",
"MU": "Маврикій", "YT": "Майотта", "MX": "Мексика", "FM": "Мікронезія", "MD": "Молдова",
"MC": "Монако", "MN": "Монголія", "ME": "Чорногорія", "MS": "Монсеррат", "MA": "Марокко",
"MZ": "Мозамбік", "MM": "М'янма", "NA": "Намібія", "NR": "Науру", "NP": "Непал",
"NL": "Нідерланди", "NC": "Нова Каледонія", "NZ": "Нова Зеландія", "NI": "Нікарагуа", "NE": "Нігер",
"NG": "Нігерія", "NU": "Ніуе", "NF": "Норфолк", "MP": "Північні Маріанські острови", "NO": "Норвегія",
"OM": "Оман", "PK": "Пакистан", "PW": "Палау", "PS": "Палестина", "PA": "Панама",
"PG": "Папуа-Нова Гвінея", "PY": "Парагвай", "PE": "Перу", "PH": "Філіппіни", "PN": "Острови Піткерн",
"PL": "Польща", "PT": "Португалія", "PR": "Пуерто-Рико", "QA": "Катар", "RE": "Реюньйон",
"RO": "Румунія", "RU": "Росія", "RW": "Руанда", "KN": "Сент-Кітс і Невіс", "LC": "Сент-Люсія",
"PM": "Сен-П'єр і Мікелон", "VC": "Сент-Вінсент і Гренадини", "WS": "Самоа", "SM": "Сан-Марино", "ST": "Сан-Томе і Принсіпі",
"SA": "Саудівська Аравія", "SN": "Сенегал", "RS": "Сербія", "SC": "Сейшельські острови", "SL": "Сьєрра-Леоне",
"SG": "Сінгапур", "SK": "Словаччина", "SI": "Словенія", "SB": "Соломонові острови", "SO": "Сомалі",
"ZA": "Південна Африка", "GS": "Південна Джорджія та Південні Сандвічеві острови", "ES": "Іспанія", "LK": "Шрі-Ланка", "SD": "Судан",
"SR": "Суринам", "SJ": "Свальбард і Ян-Маєн", "SZ": "Свазіленд", "SE": "Швеція", "CH": "Швейцарія",
"SY": "Сирія", "TW": "Тайвань", "TJ": "Таджикистан", "TZ": "Танзанія", "TH": "Таїланд",
"TL": "Східний Тимор", "TG": "Того", "TK": "Токелау", "TO": "Тонга", "TT": "Тринідад і Тобаго",
"TN": "Туніс", "TR": "Туреччина", "TM": "Туркменістан", "TC": "Теркс і Кайкос", "TV": "Тувалу",
"UG": "Уганда", "UA": "Україна", "AE": "Об'єднані Арабські Емірати", "GB": "Велика Британія", "US": "США",
"UY": "Уругвай", "UZ": "Узбекистан", "VU": "Вануату", "VE": "Венесуела", "VN": "В'єтнам",
"WF": "Уолліс і Футуна", "EH": "Західна Сахара", "YE": "Ємен", "ZM": "Замбія", "ZW": "Зімбабве"
}, ru: {

}, de: {

}, fr: {

}, it: {

}, nl: {

}, fi: {

}, no: {

}, sv: {

}, es: {

}, pt: {

}, tr: {

}, el: {

}, zh: {

}, ja: {

}, ko: {

}, hi: {

}, ar: {

}, he: {

}};
