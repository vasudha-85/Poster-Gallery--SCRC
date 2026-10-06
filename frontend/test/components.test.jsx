import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import AdminLogin from '../src/views/AdminLogin'
import Dashboard from '../src/views/Dashboard'
import Gallery from '../src/views/Gallery'
import ExhibitView from '../src/views/ExhibitView'
import QRCodeModal from '../src/views/QRCodeModal'
import PosterView from '../src/views/PosterView'
import CanvasEditor from '../src/views/CanvasEditor'
import SharedQRCodeModal from '../src/components.jsx/QRCodeModal'

const exhibit = {
  id: 'sample', title: 'Sample Exhibit', duration: '2:30', zones: 2,
  sections: [
    { name: 'Opening', type: 'Circle', x: 10, y: 15, w: 20, h: 20, color: '#123456', start: '0:00', end: '1:00' },
    { name: 'Finale', type: 'Square', x: 40, y: 45, w: 30, h: 25, color: '#654321', start: '1:00', end: '2:30' },
  ],
}

function LocationLabel() {
  return <span data-testid="location">{useLocation().pathname}</span>
}

describe('AdminLogin', () => {
  it('reports invalid passwords, toggles visibility, and enters the dashboard after the demo password', async () => {
    const user = userEvent.setup()
    render(<AdminLogin />)
    const password = screen.getByPlaceholderText('Enter admin password')
    await user.type(password, 'wrong')
    await user.click(screen.getByRole('button', { name: 'Sign In Securely' }))
    expect(screen.getByText('Invalid administrative password token specified.')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button')[0])
    expect(password).toHaveAttribute('type', 'text')
    await user.clear(password)
    await user.type(password, 'admin123')
    await user.click(screen.getByRole('button', { name: 'Sign In Securely' }))
    expect(screen.getByText('Administrative Control Panel')).toBeInTheDocument()
  })

  it('shows the new exhibit view and signs out back to login', async () => {
    const user = userEvent.setup()
    render(<AdminLogin />)
    await user.type(screen.getByPlaceholderText('Enter admin password'), 'admin123')
    await user.click(screen.getByRole('button', { name: 'Sign In Securely' }))
    await user.click(screen.getAllByRole('button', { name: 'New Exhibit' })[0])
    expect(screen.getByText('New Exhibit Upload Wizard Stage 1')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Cancel and Return to Dashboard/ }))
    await user.click(screen.getAllByRole('button')[1])
    expect(screen.getByText('Secure Management Portal')).toBeInTheDocument()
  })
})

describe('Dashboard', () => {
  it('renders exhibit cards and reports create and sign-out actions', async () => {
    const user = userEvent.setup()
    const onNewExhibit = vi.fn()
    const onSignOut = vi.fn()
    render(<Dashboard onNewExhibit={onNewExhibit} onSignOut={onSignOut} />)
    expect(screen.getAllByRole('heading', { name: 'Smart City Infrastructure' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Eco Environmental Monitor' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Smart Mobility & Transit' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /New Exhibit/ }))
    await user.click(screen.getByTitle('Sign Out'))
    expect(onNewExhibit).toHaveBeenCalledOnce()
    expect(onSignOut).toHaveBeenCalledOnce()
  })
})

describe('Gallery and exhibit navigation', () => {
  it('filters ready and pending exhibits, opens QR details, and navigates to the admin route', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/']}><Gallery /><LocationLabel /></MemoryRouter>)
    expect(screen.getByText('3 exhibits available')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ready' }))
    expect(screen.getByText('2 exhibits available')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pending' }))
    expect(screen.getByText('1 exhibits available')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Get QR Code/ }))
    expect(screen.getByRole('heading', { name: 'QR Code' })).toBeInTheDocument()
    expect(screen.getByText('Smart City Infrastructure 2045')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button').at(-3))
    expect(screen.queryByRole('heading', { name: 'QR Code' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Portal Login/ }))
    expect(screen.getByTestId('location')).toHaveTextContent('/admin')
  })

  it('opens an exhibit player and returns to the gallery', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><Gallery /></MemoryRouter>)
    await user.click(screen.getAllByRole('button', { name: /View Exhibit/ })[0])
    expect(screen.getByText('Smart City Infrastructure 2045')).toBeInTheDocument()
    expect(screen.getByText('Timeline Chapters')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button')[0])
    expect(screen.getAllByText('Exhibit Collection').length).toBeGreaterThan(0)
  })
})

describe('ExhibitView', () => {
  it('selects a section and toggles playback state', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    const { container } = render(<ExhibitView exhibit={exhibit} onBack={onBack} />)
    expect(screen.getAllByText('Opening').length).toBeGreaterThan(0)
    await user.click(screen.getAllByText('Finale')[0])
    expect(container.querySelector('.ring-2.ring-white')).toBeInTheDocument()
    const inactiveBars = container.querySelectorAll('.bg-gray-700').length
    await user.click(screen.getByRole('button', { name: 'Play audio' }))
    expect(container.querySelectorAll('.bg-gray-700').length).toBeLessThan(inactiveBars)
    expect(screen.getByRole('button', { name: 'Pause audio' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back to gallery' }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})

describe('QRCodeModal', () => {
  it('renders a title and encoded QR URL and closes', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<QRCodeModal url="https://example.test/poster/42" exhibitId="sample & one" title="Sample" onClose={onClose} />)
    expect(screen.getByText('https://example.test/poster/42')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button')[0])
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders its available URL and closes on request', async () => {
    const onClose = vi.fn()
    render(<QRCodeModal url="https://share.example.test" onClose={onClose} />)
    expect(screen.getByText('https://share.example.test')).toBeInTheDocument()
    await userEvent.setup().click(screen.getAllByRole('button')[0])
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('uses clipboard sharing fallback when Web Share is unavailable', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined })
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {})
    render(<SharedQRCodeModal exhibitId="id" title="Item" onClose={() => {}} />)
    await user.click(screen.getAllByRole('button').at(-1))
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('-id.web-app.com'))
    expect(alert).toHaveBeenCalledWith('Link copied directly to your clipboard!')
    alert.mockRestore()
  })
})

describe('PosterView', () => {
  it('shows the current poster id and media panel', () => {
    render(<MemoryRouter initialEntries={['/poster/42']}><Routes><Route path="/poster/:id" element={<PosterView />} /></Routes></MemoryRouter>)
    expect(screen.getByText('Poster Canvas 42')).toBeInTheDocument()
    expect(screen.getByText('Media Panel')).toBeInTheDocument()
  })
})

describe('CanvasEditor', () => {
  it('edits section properties, switches shape, saves, and can discard', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onCancel = vi.fn()
    render(<CanvasEditor exhibit={exhibit} onSave={onSave} onCancel={onCancel} />)
    const label = screen.getByDisplayValue('Finale')
    fireEvent.change(label, { target: { value: 'Finale revised' } })
    await user.click(screen.getByRole('button', { name: /Circle/ }))
    await user.click(screen.getByRole('button', { name: /Save Configuration/ }))
    expect(onSave).toHaveBeenCalledWith('sample', expect.arrayContaining([expect.objectContaining({ name: 'Finale revised', type: 'Circle' })]))
    await user.click(screen.getByRole('button', { name: /Discard Changes/ }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
