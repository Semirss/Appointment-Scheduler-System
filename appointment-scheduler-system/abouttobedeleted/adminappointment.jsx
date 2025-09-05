"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

/**
 * @typedef {Object} Appointment
 * @property {number} appointment_id
 * @property {number} company_id
 * @property {number} client_id
 * @property {number} service_id
 * @property {string} start_time
 * @property {string} end_time
 * @property {string} status
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [service_name]
 * @property {string} [branch_name]
 * @property {string} [location]
 */

/**
 * @typedef {Object} CompanyAppointmentCount
 * @property {number} company_id
 * @property {string} company_name
 * @property {number} appointment_count
 */

export default function AppointmentsDashboard() {
const [appointments, setAppointments] = useState([])
  const [topCompanies, setTopCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/appointments")
        const data = await response.json()

        if (data.success) {
          setAppointments(data.data)

          const companyCount = data.data.reduce(
            (acc, appointment) => {
              const companyId = appointment.company_id
              if (!acc[companyId]) {
                acc[companyId] = {
                  count: 0,
                  name: `Company ${companyId}`, // You might want to fetch actual company names from your companies table
                }
              }
              acc[companyId].count++
              return acc
            },
            {},
          )

          // Convert to array and sort by appointment count
          const sortedCompanies = Object.entries(companyCount)
            .map(([companyId, data]) => ({
              company_id: Number.parseInt(companyId),
              company_name: data.name,
              appointment_count: data.count,
            }))
            .sort((a, b) => b.appointment_count - a.appointment_count)
            .slice(0, 5) // Top 5 companies

          setTopCompanies(sortedCompanies)
        } else {
          setError("Failed to fetch appointments")
        }
      } catch (err) {
        setError("Error fetching appointments")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const topCompaniesData = topCompanies.map((company, index) => ({
    name: company.company_name,
    appointments: company.appointment_count,
    color: `hsl(${index * 60}, 70%, 50%)`,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Companies by Appointments
          </CardTitle>
          <CardDescription>Companies with the most appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">{error}</div>
            </div>
          ) : topCompanies.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">No appointment data available</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCompaniesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCompanies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Company</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCompanies[0]?.appointment_count || 0}</div>
            <p className="text-xs text-muted-foreground">{topCompanies[0]?.company_name || "No data"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
