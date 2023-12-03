import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React, { useState, useEffect } from 'react';
const columns = [
  {
    headerName: 'Name', field: 'name', defaultSort: 'asc',
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  { headerName: 'Email', field: 'email' },
  { headerName: 'Role', field: 'role' },
];
const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  draggable: true,
  flex: 1,
  columnMenuType: 'filters',
  editable: true,
  floatingFilter: true,
  filterParams: {
    buttons: ['reset', 'apply'],
    closeOnApply: true,
  }
};
const gridOptions = {
  columnDefs: columns,
  defaultColDef: defaultColDef,
  rowSelection: 'multiple',
  filter: true,
  pagination: true,
  paginationPageSize: 10,
  rowMultiSelectWithClick: true,
  rowDeselection: true,
  editType: 'fullRow',
  paginationSizeSelector: [10, 25, 50, 100],
};

const RenderGrid = ({ data }) => {
  console.log("TEDRD");
  const [rowData, setRowData] = useState(data); // [data]
  const [searchTerm, setSearchTerm] = useState('');
  const gridRef = React.useRef(null);

  useEffect(() => {
    if (!data) return;
    console.log("Setting row data")
    data = data.map((item, index) => {
      return { ...item, deleted: false };
    })
    setRowData(data);
  }, []);

  const actionCols = [
    {
      headerName: 'Edit', field: 'edit', editable: false,
      cellRenderer: (params) => {
        return (
          <>
            <button
              style={{ backgroundColor: 'transparent', border: 'none' }}
              onClick={() => params.api.startEditingCell({ rowIndex: params.rowIndex, colKey: 'name' })}
            >
              <img src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png" alt="edit" />
            </button>
          </>
        )
      }
    },
    {
      headerName: 'Delete', field: 'delete', editable: false,
      cellRenderer: (params) => {
        return (
          <>
            <button onClickCapture={(event) => {
              event.preventDefault();
              event.stopPropagation();
              event.nativeEvent.stopImmediatePropagation();
              event.nativeEvent.stopPropagation();
              event.nativeEvent.preventDefault();
              const rowItem = params.data;
              rowItem.deleted = true;
              const modifiedRowData = rowData.map((item) => { return item.id === rowItem.id ? rowItem : item });
              setRowData(modifiedRowData);
            }}
              style={{ backgroundColor: 'transparent', border: 'none' }}
            >
              <img src="https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png" alt="delete" />
            </button>
          </>
        )
      }
    },
  ];


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };



  const filteredData = data.filter((item) => {
    for (let key in item) {
      if (item[key].toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
    }
  }
  );


  useEffect(() => {
    console.log("search term changed", searchTerm);
    setRowData(filteredData);
  }, [searchTerm]);


  const deleteSelected = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const modifiedRowData = rowData.map((item) => {
      for (let i = 0; i < selectedData.length; i++) {
        if (item.id === selectedData[i].id) {
          item.deleted = true;
          break;
        }
      }
      return item;
    });
    setRowData(modifiedRowData);
  }


  gridOptions.columnDefs = [...columns, ...actionCols];


  return (

    <div style={{ display: 'grid' }}>
      <div style={{ display: "flex", flexDirection: "row" }} >
        <input style={{ fontSize: '18px', height: '30px', width: '80%', marginBottom: '10px', padding: '10px', borderRadius: '2px', border: 'black' }} type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
        <button style={{ backgroundColor: 'white', border: 'none', height: '48px', marginLeft: '5px', padding: '10px' }} onClick={deleteSelected}
        // disabled={gridRef.current.api.getSelectedNodes().length === 0}
        >
          Delete Selected
        </button>
      </div>
      <div className="ag-theme-alpine" style={{ height: "90vmax", width: "98vmin", maxHeight: "36rem" }}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={rowData.filter((item) => !item.deleted)}
          ref={gridRef}
        />
      </div>
    </div>
  )
}

export default RenderGrid;