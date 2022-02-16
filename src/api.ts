const baseURL = 'https://org-chart-api.herokuapp.com/'
const employeesURL = 'employee/'

export const fetchEmployees = async () => {
  const response = await fetch(`${baseURL}${employeesURL}`)
  const data = await response.json()
  return data
}
