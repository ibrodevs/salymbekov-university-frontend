const API_BASE_URL = 'https://med-backend-d61c905599c2.herokuapp.com/api/admissions';

const admissionsAPI = {
  submitWithAttachments: async (data) => {
    const form = new FormData();
    // plain fields
    const fields = [
      'program','firstName','lastName','middleName','birthDate','gender','phone','email','address',
      'schoolName','graduationYear','certificateNumber','ortScore','agreeTerms','agreePrivacy','submittedAt'
    ];
    fields.forEach(k => {
      if (data[k] !== undefined && data[k] !== null) form.append(k, String(data[k]));
    });
    // files
    const docs = data.documents || {};
    ['certificate','passport','medical','ortCertificate'].forEach(k => {
      if (docs[k]) form.append(k, docs[k]);
    });
    if (docs.photos && docs.photos.length) {
      Array.from(docs.photos).forEach(f => form.append('photos', f));
    }

    // Добавляем описания документов
    const documentDescriptions = {
      certificate: "Аттестат об окончании школы (High school diploma)",
      passport: "Копия паспорта (Passport ID copies)",
      medical: "Медицинское заключение (Medical certificate 086u)",
      photos: "Фотографии 3x4 см (3x4 cm photos)",
      ortCertificate: "ОРТ сертификат (ORT certificate)"
    };
    form.append('document_descriptions', JSON.stringify(documentDescriptions));

    const res = await fetch(`${API_BASE_URL}/applications/submit-email/`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
};

export default admissionsAPI;
