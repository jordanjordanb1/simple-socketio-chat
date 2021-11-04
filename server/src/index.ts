import app from '@server'
import './pre-start' // Must be the first import

// Start the server
const port = Number(process.env.PORT || 3001)
app.listen(port, () => {})
