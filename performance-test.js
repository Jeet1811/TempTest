const { exec } = require("child_process");

exec(
  'lighthouse http://localhost:3000 --quiet --chrome-flags="--headless" --output html --output-path=./reports/performance-report.html',
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log("✅ Performance report generated at ./reports/performance-report.html");
  }
);
