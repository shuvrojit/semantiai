import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScholarshipModal from '../ScholarshipModal';

describe('ScholarshipModal', () => {
  const mockScholarship = {
    title: 'Test Scholarship',
    organization: 'Test University',
    amount: '$5000',
    deadline: new Date('2024-12-31'),
    eligibility: ['GPA > 3.0'],
    requirements: ['Application Form'],
    field_of_study: ['Computer Science'],
    degree_level: ['Bachelor'],
    country: 'United States',
    link: 'https://test.edu/scholarship',
    status: 'active' as const,
    additional_info: {}
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders in view mode correctly', () => {
    render(
      <ScholarshipModal
        scholarship={mockScholarship}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="view"
      />
    );

    expect(screen.getByText('Scholarship Details')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Scholarship')).toBeDisabled();
    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument();
  });

  it('renders in edit mode with editable fields', () => {
    render(
      <ScholarshipModal
        scholarship={mockScholarship}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit"
      />
    );

    expect(screen.getByText('Edit Scholarship')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Scholarship')).not.toBeDisabled();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('renders in create mode with empty fields', () => {
    render(
      <ScholarshipModal
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="create"
      />
    );

    expect(screen.getByText('Create Scholarship')).toBeInTheDocument();
    expect(screen.getByText('Create Scholarship')).toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    render(
      <ScholarshipModal
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="create"
      />
    );

    const submitButton = screen.getByText('Create Scholarship');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Organization is required')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('handles array field operations correctly', async () => {
    render(
      <ScholarshipModal
        scholarship={mockScholarship}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit"
      />
    );

    // Add new eligibility
    const addButton = screen.getByText('+ Add eligibility');
    fireEvent.click(addButton);

    const eligibilityInputs = screen.getAllByDisplayValue(/GPA > 3.0|/);
    expect(eligibilityInputs).toHaveLength(2);

    // Remove eligibility
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      const remainingInputs = screen.getAllByDisplayValue('');
      expect(remainingInputs).toHaveLength(1);
    });
  });

  it('calls onSave with updated data when form is valid', async () => {
    render(
      <ScholarshipModal
        scholarship={mockScholarship}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit"
      />
    );

    // Update title
    const titleInput = screen.getByDisplayValue('Test Scholarship');
    fireEvent.change(titleInput, { target: { value: 'Updated Scholarship' } });

    // Submit form
    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockScholarship,
          title: 'Updated Scholarship'
        })
      );
    });
  });

  it('closes modal when clicking outside', () => {
    render(
      <ScholarshipModal
        scholarship={mockScholarship}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="view"
      />
    );

    // Click outside the modal
    fireEvent.mouseDown(document.body);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles status changes correctly', async () => {
    render(
      <ScholarshipModal
        scholarship={mockScholarship}
        onClose={mockOnClose}
        onSave={mockOnSave}
        mode="edit"
      />
    );

    const statusSelect = screen.getByDisplayValue('active');
    fireEvent.change(statusSelect, { target: { value: 'expired' } });

    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockScholarship,
          status: 'expired'
        })
      );
    });
  });
});
