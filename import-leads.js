var fs = require('fs');
var https = require('https');

var allLeads = JSON.parse(fs.readFileSync('src/zona/leads-import.json', 'utf8'));
var batchSize = 25;
var batches = [];
for (var i = 0; i < allLeads.length; i += batchSize) {
  batches.push(allLeads.slice(i, i + batchSize));
}

console.log('Total leads: ' + allLeads.length);
console.log('Batches: ' + batches.length);

var batchIndex = 0;
var totalImported = 0;
var totalDuplicates = 0;

function sendBatch() {
  if (batchIndex >= batches.length) {
    console.log('\n=== DONE ===');
    console.log('Total imported: ' + totalImported);
    console.log('Total duplicates: ' + totalDuplicates);
    return;
  }
  var batch = batches[batchIndex];
  var data = JSON.stringify(batch);
  var options = {
    hostname: 'zona-inmu.tours-virtuales-gt.workers.dev',
    path: '/api/leads/import',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  var req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(chunk) { body += chunk; });
    res.on('end', function() {
      try {
        var result = JSON.parse(body);
        totalImported += (result.imported || 0);
        totalDuplicates += (result.duplicates || 0);
        console.log('Batch ' + (batchIndex + 1) + '/' + batches.length + ': +' + result.imported + ' imported, ' + result.duplicates + ' duplicates (total: ' + result.total + ')');
      } catch(e) {
        console.log('Batch ' + (batchIndex + 1) + ' error: ' + body);
      }
      batchIndex++;
      sendBatch();
    });
  });
  req.on('error', function(e) {
    console.log('Batch ' + (batchIndex + 1) + ' network error: ' + e.message);
    batchIndex++;
    sendBatch();
  });
  req.write(data);
  req.end();
}

sendBatch();
