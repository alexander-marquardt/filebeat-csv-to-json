        var CSV_SPLIT_CHAR = ",";


        // This function takes an array containing the field names, and another that
        // contains field values, and returns a json dictionary that combines them.

        function convert_csv_to_dict(csv_headers_row, csv_values_row) {
          var json_dict =  csv_values_row.reduce(function(result, field, index) {
            result[csv_headers_row[index]] = field;
            return result;
          }, {})

          return json_dict;
        }


        // self-calling javascript function that will be used to combine the 
        // header row with subsequent rows in the CSV file
        var headers_fn = (function() {

          // Use a javascript closure to keep the header line (csv_headers_row) around 
          // so that we can use the header values for all subsequent CSV entries. 
          var csv_headers_row = null; 
          return function(msg) {

            var csv_values_row = msg.split(CSV_SPLIT_CHAR);
            var json_dict = null;
            if (!csv_headers_row) {
              csv_headers_row = csv_values_row;
            } else {
              // combine the csv_headers_row with the values to get a dict
              json_dict = convert_csv_to_dict(csv_headers_row, csv_values_row)
            }
            return json_dict;
          }

        })();  

        

        function process(event) {
            var msg = event.Get("message");
            var json_dict = headers_fn(msg);
            if (!json_dict) {
              event.Cancel();
            }
            event.Put("json_dict", json_dict);
        }