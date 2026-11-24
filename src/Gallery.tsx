import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Badge, Button, Checkbox, Select, Table, TextField } from './index'
import type { TableColumn } from './index'

interface Member {
  id: string
  name: string
  role: string
  status: 'Active' | 'Pending'
}

const members: Member[] = [
  { id: '1', name: 'Test member 1', role: 'Designer', status: 'Active' },
  { id: '2', name: 'Test member 2', role: 'Developer', status: 'Active' },
  { id: '3', name: 'Test member 3', role: 'Developer', status: 'Pending' },
]

const columns: TableColumn<Member>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge tone={row.status === 'Active' ? 'success' : 'warning'}>
        {row.status}
      </Badge>
    ),
  },
]

function Gallery() {
  const [saved, setSaved] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <>
      <section aria-labelledby="settings-heading">
        <h2 id="settings-heading">Settings</h2>
        <form onSubmit={handleSubmit}>
          <TextField label="Display name" name="displayName" />
          <Select label="Language" name="language">
            <option value="en">English</option>
            <option value="fr">Tamil</option>
            <option value="de">Kannada</option>
          </Select>
          <div style={{ marginBlock: 'var(--space-4)' }}>
            <Checkbox label="Email notifications" name="emailNotifications" />
          </div>
          <Button type="submit">Save settings</Button>
        </form>
        {saved && <Alert tone="success">Settings saved.</Alert>}
      </section>

      <section aria-labelledby="team-heading">
        <h2 id="team-heading">Team</h2>
        <Table
          caption="Team members"
          columns={columns}
          rows={members}
          getRowKey={(row) => row.id}
        />
      </section>
    </>
  )
}

export default Gallery
