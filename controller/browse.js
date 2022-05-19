const { browseNodesTreeShallow, browseNodesTree } = require("../OPCUA-client/opcua-client");

exports.postBrowse = async (req, res) => {
    try {
        let {serverurl, nodeId} = { ...req.body }
        if (!serverurl) {
            throw new Error("Server URL must be set!");
        }

        let browseResult = nodeId ? await browseNodesTreeShallow(serverurl, nodeId) : await browseNodesTree(serverurl);
        res.json(browseResult);        
    } catch (err) {
        console.log(err);
    }
}