const fs = require('fs');
try {
  let content = fs.readFileSync('test_report.json', 'utf8');
  content = content.substring(content.indexOf('{'));
  const data = JSON.parse(content);
  const failures = data.testResults.filter(t => t.status === 'failed');
  if (failures.length === 0) {
    console.log("No failed tests found.");
  }
  failures.forEach(f => {
    console.log('FILE: ' + f.name);
    if (f.assertionResults) {
      f.assertionResults.filter(a => a.status === 'failed').forEach(a => {
        console.log('  TEST: ' + a.title);
        if (a.failureMessages && a.failureMessages.length > 0) {
          console.log('  ERR: ' + a.failureMessages[0].substring(0, 200).replace(/\n/g, ' '));
        }
      });
    }
  });
} catch (e) { console.error(e); }
