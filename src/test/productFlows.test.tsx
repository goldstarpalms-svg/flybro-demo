import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

/**
 * Product-level UI tests — these exercise the real rendered interface:
 * search validation, a successful sample search, sorting, filtering,
 * flight details, and the labelled booking demonstration.
 */

function getSearchForm() {
  return screen.getByRole("form", { name: /flight search/i });
}

describe("FlyBro demo — product flows", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the homepage hero and navigation", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/without the stress/i);
    expect(getSearchForm()).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("validates the search form instead of searching", async () => {
    const user = userEvent.setup();
    render(<App />);
    const form = getSearchForm();

    // Change the destination to Lagos — identical to the origin.
    await user.click(within(form).getByRole("button", { name: /^to:/i }));
    const listbox = screen.getByRole("listbox");
    await user.click(within(listbox).getByRole("button", { name: /^lagos/i }));

    await user.click(within(form).getByRole("button", { name: /search flights/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/different/i);
  });

  it("runs a search and shows sample results with working sort + filters + details + booking demo", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
    render(<App />);
    const form = getSearchForm();

    await user.click(within(form).getByRole("button", { name: /search flights/i }));

    // Loading feedback appears.
    expect((await screen.findAllByText(/searching sample fares/i)).length).toBeGreaterThan(0);

    // Results arrive (sample provider latency is simulated).
    await waitFor(
      () => {
        expect(screen.getByText(/sample result/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    expect(screen.getAllByText(/sample fare per adult/i).length).toBeGreaterThan(0);

    // Sort by earliest departure.
    const sort = screen.getByLabelText(/sort/i);
    await user.selectOptions(sort, "departure");
    expect(sort).toHaveValue("departure");

    // Filter: nonstop only.
    const filters = screen.getByRole("complementary", { name: /flight filters/i });
    await user.click(within(filters).getByRole("radio", { name: /nonstop only/i }));
    expect(screen.getAllByText(/sample fare per adult/i).length).toBeGreaterThan(0);

    // Reset filters.
    await user.click(within(filters).getByRole("button", { name: /reset all/i }));

    // Open details on the first card.
    await user.click(screen.getAllByRole("button", { name: /details/i })[0]);
    expect(screen.getByRole("dialog", { name: /flight details/i })).toBeInTheDocument();
    expect(screen.getByText(/sample itinerary/i)).toBeInTheDocument();

    // Continue to the booking demonstration.
    await user.click(
      within(screen.getByRole("dialog", { name: /flight details/i })).getByRole("button", {
        name: /^continue$/i,
      }),
    );
    const booking = screen.getByRole("dialog", { name: /booking demonstration/i });
    expect(booking).toBeInTheDocument();
    expect(within(booking).getByText(/doesn't sell tickets/i)).toBeInTheDocument();
    expect(within(booking).getByText(/sample total/i)).toBeInTheDocument();

    // No payment fields anywhere in the demo.
    expect(screen.queryByLabelText(/card number/i)).toBeNull();
    expect(screen.queryByLabelText(/cvv/i)).toBeNull();

    vi.useRealTimers();
  });

  it("shows an empty state when no sample flights match the route", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
    render(<App />);
    const form = getSearchForm();

    // LOS → JOS has no route table entry, so the sample dataset is empty.
    await user.click(within(form).getByRole("button", { name: /^to:/i }));
    const listbox = screen.getByRole("listbox");
    await user.click(within(listbox).getByRole("button", { name: /^jos/i }));
    await user.click(within(form).getByRole("button", { name: /search flights/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/no sample flights on this route and date/i)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    vi.useRealTimers();
  });
});
