const getDashboard = (req, res) => {
    const user = req.user;
    return res.json({
        message: 'Dashboard gotten successful',
        details: user
    })
}

const generate = (req, res) => {
    const user = req.user;
    return res.json({
        message: 'Annonymous Link Generate',
        link: 'http://localhost:5173/share/' + user.id
    })
}

module.exports = {getDashboard, generate};