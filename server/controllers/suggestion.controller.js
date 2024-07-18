
exports.suggestSpecialty = async (req, res) => {
    const { sintomas } = req.body;

    try {
        let sugerencia = 'Medicina General';

        if (sintomas.includes('tos persistente') || sintomas.includes('fiebre') || sintomas.includes('malestar general')) {
            sugerencia = 'Medicina General';
        } else if (sintomas.includes('heridas') || sintomas.includes('cuidados postoperatorios') || sintomas.includes('inyecciones')) {
            sugerencia = 'Enfermería';
        } else if (sintomas.includes('problemas de peso') || sintomas.includes('dietas desequilibradas') || sintomas.includes('déficit nutricional')) {
            sugerencia = 'Nutrición';
        } else if (sintomas.includes('embarazo') || sintomas.includes('dolor pélvico') || sintomas.includes('problemas menstruales')) {
            sugerencia = 'Obstetricia';
        } else if (sintomas.includes('dolor de muelas') || sintomas.includes('caries') || sintomas.includes('problemas de encías')) {
            sugerencia = 'Odontología';
        } else if (sintomas.includes('ansiedad') || sintomas.includes('depresión') || sintomas.includes('estrés')) {
            sugerencia = 'Psicología';
        }

        return res.status(200).json({ sugerencia });
    } catch (error) {
        console.error('Error en la función suggestSpecialty:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};
