
        // This function takes an array containing the field names, and another that
        // contains field values, and returns a json dictionary that combines them.
        function convert_csv_to_dict(csv_headers_row, csv_values_row) {
          var json_from_csv =  csv_values_row.reduce(function(result, field, index) {
            result[csv_headers_row[index]] = field;
            return result;
          }, {})

          return json_from_csv;
        }


        // Define the Javascript function that will be used to combine the 
        // header row with subsequent rows in the CSV file
        var headers_fn = (function() {
          var csv_headers_row = null; 

          // Use a javascript closure to store the header line (csv_headers_row), 
          // so that we can use the header values for all subsequent CSV entries. 
          return function(csv_arr) {

            var json_from_csv = null;

            if (!csv_headers_row) {
              // if this is the first row, store the headers
              csv_headers_row = csv_arr;
            } else {
              // combine the csv_headers_row with the values to get a dict
              json_from_csv = convert_csv_to_dict(csv_headers_row, csv_arr)
            }
            return json_from_csv;
          }

        })();  

        
        // This function is called for each "event" 
        // (eg. called once for each line in the log file)
        function process(event) {
            var csv_arr = event.Get("decoded_csv_arr");
            var json_from_csv = headers_fn(csv_arr);

            // If the current event was triggered to process the header row,
            // then the json_from_csv will be empty - it only returns a json dict
            // for subsequent rows. Cancel the event so that nothing
            // is sent to the output.
            if (!json_from_csv) {
              event.Cancel();
            }
            event.Put("json_from_csv", json_from_csv);
        }