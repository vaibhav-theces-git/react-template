# Hierarchy selector component

## Basic component usage



    const  treeState  =  {
    "id":  "coinbaseprime",
    "label":  "coinbaseprime",
    "selected":  false,
    "children":  [
	    {
	    "id":  2123,
	    "label":  "ABC-OKEX",
	    "selected":  false,
	    "children":  [
	    {
	    "id":  "SPOT",
	    "label":  "SPOT",
	    "selected":  false,
	    "children":  null,
		    }]
	    }]
    }

    <HierarchySelector
    selectAllLabel="Select all Sub Accounts"
    placeholder="Select Account"
    initialTreeState={treeState}
    multiSelect={true}
    onTreeUpdate={(tree: TreeState |  null) =>
    console.log(tree, "state")// updated new treeState object
    }
    />
