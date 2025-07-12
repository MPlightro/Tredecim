// Tredecim Calendar .ics Generator (export + optional browser download)

const tredecimMonths = [
  "August", "March", "Tricember", "April", "May", "January",
  "September", "October", "November", "December", "February", "June", "July"
];

const holidays = [
  { name: "The Day of August", day: 14, month: 0 },
  { name: "Triday", day: 3, month: 2 },
  { name: "Pi Day", day: 14, month: 2 },
  { name: "Creation Day", day: 5, month: 3 },
  { name: "Gregorian Day", day: 14, month: 5 },
  { name: "Sept-day", day: 7, month: 6 },
  { name: "Octaday", day: 8, month: 7 },
  { name: "Noveday", day: 9, month: 8 },
  { name: "Decaday", day: 10, month: 9 },
  { name: "Forevery 29", day: 29, month: 10 },
  { name: "Summer Celebration", day: 21, month: 11 }
];

function isLeapYear(year) {
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

function formatDate(dt) {
  return dt.toISOString().split("T")[0].replace(/-/g, "");
}

function generateICS(startYear, endYear) {
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";

  for (let year = startYear; year <= endYear; year++) {
    const leap = isLeapYear(year);
    const startDate = new Date(year, 7, 0); // July 31 (Intermission if leap)

    if (leap) {
      ics += `BEGIN:VEVENT\nSUMMARY:🎉 Intermission\nDTSTART;VALUE=DATE:${year}0731\nDTEND;VALUE=DATE:${year}0801\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:0\nEND:VEVENT\n`;
    }

    let date = new Date(year, 7, 1); // Aug 1
    let tMonth = 0;
    let tDay = 1;

    for (let d = 0; d < 365 + (leap ? 1 : 0); d++) {
      const gYear = date.getFullYear();
      const gDate = formatDate(date);

      if (leap && gDate === `${year}0731`) {
        date.setDate(date.getDate() + 1);
        continue;
      }

      const holiday = holidays.find(h => h.day === tDay && h.month === tMonth);
      let label = holiday
        ? `🎉 ${holiday.name} (${tDay} ${tredecimMonths[tMonth]})`
        : `Today is ${tDay} ${tredecimMonths[tMonth]}`;

      ics += `BEGIN:VEVENT\nSUMMARY:${label}\nDTSTART;VALUE=DATE:${gDate}\nDTEND;VALUE=DATE:${gDate}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:0\nEND:VEVENT\n`;

      tDay++;
      if ((tMonth === 10 && tDay > 29) || (tMonth !== 10 && tDay > 28)) {
        tDay = 1;
        tMonth++;
        if (tMonth > 12) break;
      }

      date.setDate(date.getDate() + 1);
    }
  }

  ics += "END:VCALENDAR";
  return ics;
}

// For manual download in-browser (generate once and upload)
function triggerICSDownload(startYear = 2025, endYear = 2030) {
  const content = generateICS(startYear, endYear);
  const blob = new Blob([content], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `tredecim-calendar.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
