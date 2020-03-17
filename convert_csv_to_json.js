        var CSV_SPLIT_CHAR = ",";


        // This function takes an array containing the field names, and another that
        // contains field values, and returns a json dictionary that combines them.

        function convert_csv_to_dict(headers, values) {
          var result =  values.reduce(function(result, field, index) {
            result[headers[index]] = field;
            return result;
          }, {})

          return result;
        }



        // Use a javascript _closure_ to keep the header line around so that we can use 
        // the header values for all subsequent CSV entries. 

        var headers_fn = (function() {
          var headers_arr = null; 
          return function(msg) {

            var split_vals = msg.split(CSV_SPLIT_CHAR);
            var json_dict = null;
            if (!headers_arr) {
              headers_arr = split_vals;
            } else {
              // combine the headers_arr with the values to get a dict
              json_dict = convert_csv_to_dict(headers_arr, split_vals)
            }
            return json_dict;
          }
        })();  // self-calling javascript function

        

        function process(event) {
            var msg = event.Get("message");
            var json_dict = headers_fn(msg);
            if (!json_dict) {
              event.Cancel();
            }
            event.Put("json_dict", json_dict);
        }