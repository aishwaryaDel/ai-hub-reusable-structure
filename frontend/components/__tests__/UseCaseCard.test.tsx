import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UseCaseCard from '../UseCaseCard';
import { UseCase } from '../../types';
const mockUseCase: UseCase = {
  id: '1',
  title: 'Test Use Case',
  short_description: 'This is a test use case description',
  full_description: 'Full description',
  department: 'IT',
  status: 'Live',
  owner_name: 'John Doe',
  owner_email: 'john@example.com',
  business_impact: 'High impact',
  technology_stack: ['React', 'Node.js', 'PostgreSQL'],
  internal_links: {
    wiki: 'http://wiki.example.com',
    confluence: 'http://confluence.example.com',
  },
  tags: ['ai', 'automation', 'ml'],
  related_use_case_ids: [],
  application_url: 'http://app.example.com',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-15'),
};

describe('UseCaseCard', () => {
  it('should render use case information', () => {
    const onClick = vi.fn();

    render(<UseCaseCard useCase={mockUseCase} onClick={onClick} />);

    expect(screen.getByText('Test Use Case')).toBeInTheDocument();
    expect(screen.getByText('This is a test use case description')).toBeInTheDocument();
    expect(screen.getByText('IT')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('should display owner information', () => {
    const onClick = vi.fn();

    render(<UseCaseCard useCase={mockUseCase} onClick={onClick} />);

    expect(screen.getByText(/By John Doe/)).toBeInTheDocument();
  });

  it('should display tags', () => {
    const onClick = vi.fn();

    render(<UseCaseCard useCase={mockUseCase} onClick={onClick} />);

    expect(screen.getByText('#ai')).toBeInTheDocument();
    expect(screen.getByText('#automation')).toBeInTheDocument();
    expect(screen.getByText('#ml')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<UseCaseCard useCase={mockUseCase} onClick={onClick} />);

    const card = screen.getByRole('button');
    await user.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<UseCaseCard useCase={mockUseCase} onClick={onClick} />);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render different status colors', () => {
    const onClick = vi.fn();
    const useCaseWithDifferentStatus: UseCase = {
      ...mockUseCase,
      status: 'PoC',
    };

    render(<UseCaseCard useCase={useCaseWithDifferentStatus} onClick={onClick} />);

    expect(screen.getByText('PoC')).toBeInTheDocument();
  });

  it('should handle use case without application URL', () => {
    const onClick = vi.fn();
    const useCaseWithoutUrl: UseCase = {
      ...mockUseCase,
      application_url: null,
    };

    render(<UseCaseCard useCase={useCaseWithoutUrl} onClick={onClick} />);

    expect(screen.getByText('Test Use Case')).toBeInTheDocument();
  });

  it('should display only first 3 tags when more are available', () => {
    const onClick = vi.fn();
    const useCaseWithManyTags: UseCase = {
      ...mockUseCase,
      tags: ['ai', 'automation', 'ml', 'analytics', 'chatbot'],
    };

    render(<UseCaseCard useCase={useCaseWithManyTags} onClick={onClick} />);

    expect(screen.getByText('#ai')).toBeInTheDocument();
    expect(screen.getByText('#automation')).toBeInTheDocument();
    expect(screen.getByText('#ml')).toBeInTheDocument();
    expect(screen.queryByText('#analytics')).not.toBeInTheDocument();
    expect(screen.queryByText('#chatbot')).not.toBeInTheDocument();
  });

  it('should render image with proper alt text', () => {
    const onClick = vi.fn();

    render(<UseCaseCard useCase={mockUseCase} onClick={onClick} />);

    const image = screen.getByAltText('Test Use Case');
    expect(image).toBeInTheDocument();
  });
});
