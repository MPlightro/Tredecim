// Tredecim Calendar .ics Generator with Correct Gregorian Alignment + Preview (Auto-show)

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
  return dt.toISOString().split("T")[0];
}

function generateICS(startYear, endYear) {
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
  let preview = [];

  for (let year = startYear; year <= endYear; year++) {
    const leap = isLeapYear(year);
    const gregorianStart = new Date(year, 7, 1); // August 1

    let gDate = new Date(gregorianStart);
    gDate.setDate(gDate.getDate() + 1); // OFFSET FIX: Correct alignment

    let tMonth = 0;
    let tDay = 1;

    while (tMonth < 13) {
      const isFeb = tMonth === 10;
      const maxDay = isFeb ? 29 : 28;

      if (tDay > maxDay) {
        tDay = 1;
        tMonth++;
        continue;
      }

      // Add intermission BEFORE August if leap year and at first day of calendar
      if (leap && tMonth === 0 && tDay === 1) {
        const intermissionDate = new Date(gDate);
        intermissionDate.setDate(intermissionDate.getDate() - 1);
        const intermissionStr = formatDate(intermissionDate);
        ics += `BEGIN:VEVENT\nSUMMARY:🎉 Intermission\nDTSTART;VALUE=DATE:${intermissionStr.replace(/-/g, "")}\nDTEND;VALUE=DATE:${intermissionStr.replace(/-/g, "")}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:0\nEND:VEVENT\n`;
        preview.push({ gregorian: intermissionStr, tredecim: "Intermission" });
      }

      const gregDateStr = formatDate(gDate);
      const gregCompact = gregDateStr.replace(/-/g, "");

      const holiday = holidays.find(h => h.day === tDay && h.month === tMonth);
      const label = holiday
        ? `🎉 ${holiday.name} (${tDay} ${tredecimMonths[tMonth]})`
        : `${tDay} ${tredecimMonths[tMonth]} ${year}`;

      preview.push({ gregorian: gregDateStr, tredecim: `${tDay} ${tredecimMonths[tMonth]}` });

      ics += `BEGIN:VEVENT\nSUMMARY:${label}\nDTSTART;VALUE=DATE:${gregCompact}\nDTEND;VALUE=DATE:${gregCompact}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:0\nEND:VEVENT\n`;

      tDay++;
      gDate.setDate(gDate.getDate() + 1);
    }
  }

  ics += "END:VCALENDAR";
  window.tredecimPreview = preview;
  showPreviewTable();
  return ics;
}

function triggerICSDownload(startYear = 2025, endYear = 2030) {
  const content = generateICS(startYear, endYear);
  const blob = new Blob([content], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tredecim.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showPreviewTable() {
  if (!window.tredecimPreview) return;
  const filter = [
    '2025-08-01', // August 1, 2025
    '2028-07-31', // Intermission 2028
    '2029-07-31', // July 28, 2028
    '2029-08-01'  // August 1, 2029
  ];

  const container = document.getElementById("preview") || document.createElement("div");
  container.id = "preview";
  const filtered = window.tredecimPreview.filter(p => filter.includes(p.gregorian));

  container.innerHTML = `<h2>Date Preview</h2><table><thead><tr><th>Gregorian</th><th>Tredecim</th></tr></thead><tbody>
    ${filtered.map(p => `<tr><td>${p.gregorian}</td><td>${p.tredecim}</td></tr>`).join("")}
  </tbody></table>`;
  document.body.appendChild(container);
}

window.addEventListener("DOMContentLoaded", () => {
  generateICS(2025, 2029);
});
