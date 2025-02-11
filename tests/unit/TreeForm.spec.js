import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TreeForm from '../../src/components/TreeForm.vue';

// Test-Suite für die TreeForm-Komponente
describe('TreeForm.vue', () => {
  
  // Testet, ob die Komponente korrekt gerendert wird
  it('rendert das Formular korrekt', () => {
    const wrapper = mount(TreeForm);
    expect(wrapper.find('form').exists()).toBe(true);
  });
  
  // Testet, ob das Eingabefeld für die Baumart vorhanden ist
  it('hat ein Eingabefeld für die Baumart', () => {
    const wrapper = mount(TreeForm);
    expect(wrapper.find('input#tree-type').exists()).toBe(true);
  });
  
  
  // Testet, ob die Eingabe im Baumart-Feld korrekt funktioniert
  it('ändert den Wert des Baumart-Eingabefelds', async () => {
    const wrapper = mount(TreeForm);
    const input = wrapper.find('input#tree-type');
    await input.setValue('Eiche');
    expect(input.element.value).toBe('Eiche');
  });
  
  // Testet, ob das Formular-Submit-Event ausgelöst wird
  it('löst das Submit-Event aus, wenn das Formular abgeschickt wird', async () => {
    const wrapper = mount(TreeForm);
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.emitted('submit')).toBeTruthy();
  });

});
