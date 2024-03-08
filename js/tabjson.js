/**
 * Renders JSON data into a DataTable with an option to use the first column as an index.
 * 
 * @param {string} selector - The CSS selector for the table element.
 * @param {Object[]} jsonData - An array of objects representing the JSON data.
 * @param {boolean} useIndex - Whether to use the first column as an index column.
 */
function renderJsonToDataTable(selector, jsonData, useIndex = false) {
    console.clear();  
    console.log("rendering")

    // remove blacklisted column from jsondata
    let blacklisted = ["_NullFlags"];
    jsonData = jsonData.map(item => {
      blacklisted.forEach(bl => {
        delete item[bl];
      });
      return item;
    });

    // remove the keys that are balnk throughout the jsondata
    let keys = Object.keys(jsonData[0]);
    keys.forEach(key => {
      let allBlank = true;
      jsonData.forEach(item => {
        if (item[key] && item[key].toString().trim() !== '') {
          allBlank = false;
        }
      }
      );
      if (allBlank) {
        jsonData.forEach(item => {
          delete item[key];
        });
      }
    });
    


    if (!jsonData || !jsonData.length) {
      console.error('JSON data is empty or not provided');
      return;
    }
  
    // Ensure the DataTables library is loaded
    if (!$.fn.DataTable) {
      console.error('DataTable library is not loaded');
      return;
    }
  
    const $table = $(selector);
    
    // Clear previous table data if any
    $table.empty();
  
    // Assuming all objects have the same structure, take the keys of the first object for column headers
    const columns = Object.keys(jsonData[0]);
    const modifiedColumns = useIndex ? ['Index'].concat(columns) : columns;
    
    // Create thead and tfoot
    const theadTr = $('<tr/>');
    const tfootTr = $('<tr/>');
    modifiedColumns.forEach((column, index) => {
      theadTr.append(`<th>${column}</th>`);
      tfootTr.append(`<td>${column}</td>`);
    });
    console.log(theadTr)
    const $thead = $('<thead/>').append(theadTr);
    // const $tfoot = $('<tfoot/>').append(tfootTr);
    // $table.append($thead, $tfoot);
    
    $table.append($thead);
    // Adjust the JSON data if using the first column as an index
    const modifiedJsonData = useIndex ? jsonData.map((item, index) => ({ Index: index + 1, ...item })) : jsonData;
  
    // Initialize DataTable
    var table = $table.DataTable({
      data: modifiedJsonData,
      columns: modifiedColumns.map(column => ({ 
        data: column, 
        // Apply width adjustment for the index column
        width: column === 'Index' ? '5%' : null 
      })),
      // Additional DataTable options can be added here for more customization
    });

    function checkAndHideColumns() {
      var pageInfo = table.page.info();
      table.columns().every(function(index) {
          var column = this;
          var allBlank = true; // Assume all cells are blank initially
          var data = column.data().toArray(); // Get all data for the column

          for (var i = pageInfo.start; i < pageInfo.end; i++) {
              if (data[i] && data[i].toString().trim() !== '') {
                  allBlank = false; // Found a non-blank cell
                  // break; // Exit the loop early
              }
          }

          // Hide or show the column based on whether all cells are blank
          column.visible(!allBlank);
      });
  }

    // // Attach the checkAndHideColumns function to run after DataTable search
    // table.on('search.dt', function() {
    //     checkAndHideColumns();
    // });

    // // Attach the checkAndHideColumns function to run after DataTable page change
    // table.on('draw.dt', function() {
    //     checkAndHideColumns();
    // });

    

    setTimeout(() => {
      // checkAndHideColumns();
    }, 1000);
  }
  