const { queryByNodeId } = require('../OPCUA-client/opcua-client');

exports.postQuery = async (req, res) => {
    try {
        let {serverurl, nodeId} = { ...req.body }
        if (!serverurl || !nodeId) {
            throw new Error("Server URL and node ID must be set!");
        }
        let queryResult = await queryByNodeId(serverurl, nodeId);
        res.json(queryResult);
    } catch (err) {
        console.log(err);
    }
}