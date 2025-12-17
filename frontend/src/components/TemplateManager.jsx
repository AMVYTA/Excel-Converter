/**
 * Template Manager Component
 * Manage saved templates
 */

import { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Calendar, FileText } from 'lucide-react';
import { getAllTemplates, deleteTemplate, createTemplate } from '../services/api';
import { formatDate } from '../utils/helpers';

const TemplateManager = ({ onTemplateSelect, currentMapping, sourceFormat, targetFormat }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await getAllTemplates();
      setTemplates(response.data || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
      alert('Gagal memuat template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert('Nama template harus diisi!');
      return;
    }

    if (!currentMapping || currentMapping.length === 0) {
      alert('Tidak ada mapping untuk disimpan!');
      return;
    }

    try {
      setLoading(true);

      const templateData = {
        name: templateName,
        description: templateDescription,
        sourceFormat: sourceFormat || 'Unknown',
        targetFormat: targetFormat || 'Custom',
        columnMappings: currentMapping
      };

      await createTemplate(templateData);

      alert('Template berhasil disimpan!');
      setShowSaveModal(false);
      setTemplateName('');
      setTemplateDescription('');
      loadTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Gagal menyimpan template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteTemplate(templateId);
      alert('Template berhasil dihapus!');
      loadTemplates();
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId(null);
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('Gagal menghapus template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    onTemplateSelect(template);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Template Tersimpan
        </h3>
        <button
          onClick={() => setShowSaveModal(true)}
          disabled={loading || !currentMapping || currentMapping.length === 0}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Simpan Template
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Memuat...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-8 text-gray-500 card">
          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Belum ada template tersimpan</p>
          <p className="text-sm mt-1">Buat mapping dan simpan sebagai template</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className={`
                card cursor-pointer transition-all duration-200
                ${selectedTemplateId === template.id
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:shadow-lg'
                }
              `}
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  {template.description && (
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(template.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Mapping:</span>
                  <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                    {template.columnMappings?.length || 0} kolom
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(template.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Simpan Template</h3>

            <div className="space-y-4">
              <div>
                <label className="label">Nama Template *</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Contoh: Runchise ke Accurate"
                  className="input"
                  autoFocus
                />
              </div>

              <div>
                <label className="label">Deskripsi (Opsional)</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Keterangan tambahan tentang template ini"
                  className="input"
                  rows="3"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>Mapping: {currentMapping?.length || 0} kolom</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Batal
              </button>
              <button
                onClick={handleSaveTemplate}
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
