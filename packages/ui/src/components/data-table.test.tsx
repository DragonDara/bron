import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DataTable, type DataTableColumn } from "./data-table"

interface Row {
  name: string
}

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Name" },
  { key: "extra", header: "Extra", render: () => "-" },
]
const rows: Row[] = [{ name: "Alice" }, { name: "Bob" }, { name: "Carol" }]

describe("DataTable", () => {
  it("renders the expanded content right below the expanded row", () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        isRowExpanded={(row) => row.name === "Bob"}
        renderExpanded={(row) => <div>Details for {row.name}</div>}
      />
    )

    const bodyRows = within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row")
    expect(bodyRows.map((row) => row.textContent)).toEqual([
      "Alice-",
      "Bob-",
      "Details for Bob",
      "Carol-",
    ])
    expect(within(bodyRows[2]).getByRole("cell")).toHaveAttribute("colspan", "2")
  })

  it("does not trigger the row click from inside the expanded content", async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        onRowClick={onRowClick}
        isRowExpanded={(row) => row.name === "Alice"}
        renderExpanded={() => <button type="button">Inner</button>}
      />
    )

    await user.click(screen.getByRole("button", { name: "Inner" }))
    expect(onRowClick).not.toHaveBeenCalled()

    await user.click(screen.getByText("Bob"))
    expect(onRowClick).toHaveBeenCalledWith({ name: "Bob" })
  })
})
