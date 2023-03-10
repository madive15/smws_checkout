import { mount, render } from 'enzyme';
import React from 'react';

import FormContext from '../context/FormContext';

import FormFieldContainer from './FormFieldContainer';

describe('FormFieldContainer', () => {
    it('matches snapshot with rendered markup', () => {
        const component = render(
            <FormFieldContainer>
                <input type="text" />
            </FormFieldContainer>,
        );

        expect(component).toMatchSnapshot();
    });

    it('renders with additional classes if provided', () => {
        const component = mount(
            <FormFieldContainer additionalClassName="foobar">
                <input type="text" />
            </FormFieldContainer>,
        );

        expect(component.find('div').hasClass('form-field')).toBe(true);

        expect(component.find('div').hasClass('foobar')).toBe(true);
    });

    it('renders with error class when there is error and form is submitted', () => {
        const component = mount(
            <FormContext.Provider value={{ isSubmitted: true, setSubmitted: jest.fn() }}>
                <FormFieldContainer hasError>
                    <input type="text" />
                </FormFieldContainer>
            </FormContext.Provider>,
        );

        expect(component.find('div').hasClass('form-field--error')).toBe(true);
    });

    it('does not render with error class when there is error but form is not submitted', () => {
        const component = mount(
            <FormContext.Provider value={{ isSubmitted: false, setSubmitted: jest.fn() }}>
                <FormFieldContainer hasError>
                    <input type="text" />
                </FormFieldContainer>
            </FormContext.Provider>,
        );

        expect(component.find('div').hasClass('form-field--error')).toBe(false);
    });

    it('does not render with error class when there is no error', () => {
        const component = mount(
            <FormContext.Provider value={{ isSubmitted: true, setSubmitted: jest.fn() }}>
                <FormFieldContainer>
                    <input type="text" />
                </FormFieldContainer>
            </FormContext.Provider>,
        );

        expect(component.find('div').hasClass('form-field--error')).toBe(false);
    });
});
