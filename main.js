
//Simulador de elaboracion de analitico de estudiantes

// Variables
let materias = JSON.parse(localStorage.getItem('materias')) || [];
const formMateria = document.getElementById('formMateria');
const formEstudiante = document.getElementById('formEstudiante');
const materiaSelect = document.getElementById('materiaSelect');
const resultado = document.getElementById('resultado');

// Función para guardar en localStorage
function guardarEnStorage() {
    localStorage.setItem('materias', JSON.stringify(materias));
}

// Función para mostrar materias en el select
function actualizarMateriaSelect() {
    materiaSelect.innerHTML = '';
    materias.forEach((materia, index) => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = materia.nombreMateria;
        materiaSelect.appendChild(option);
    });
}

// Carga de Materias y datos relacionados
//desde `Agregar Materia`
formMateria.addEventListener('submit', (e) => {
    e.preventDefault();
    let nombreMateria = document.getElementById('nombreMateria').value;
    let nombreProfesor = document.getElementById('nombreProfesor').value;
    let clasesTotales = parseInt(document.getElementById('clasesTotales').value);

    let nuevaMateria = {
        nombreMateria,
        nombreProfesor,
        clasesTotales,
        estudiantes: []
    };

    materias.push(nuevaMateria);
    guardarEnStorage();
    actualizarMateriaSelect();
    formMateria.reset();
    mostrarMaterias();
});



// Función para calcular la `Condición de Asistencia` del estudiante
function calcularCondicion(asistencia, clasesTotales) {
    let porcentaje = (asistencia / clasesTotales) * 100;
    if (porcentaje >= 80) return 'Promoción Directa';
    if (porcentaje >= 60) return 'Regular';
    return 'Libre';
}


// Función para calcular `Promedio`
function calcularPromedio(nota1, nota2, nota3) {
    let notas = [nota1, nota2];
    if (nota3 !== null) {
        notas.push(nota3);
    }
    let suma = notas.reduce((acc, nota) => acc + nota, 0);
    return (suma / notas.length).toFixed(2); // se devuelve el promedio con dos decimales
}

// Agregar Estudiante con cálculo de promedio
formEstudiante.addEventListener('submit', (e) => {
    e.preventDefault();
    let indiceMateria = materiaSelect.value;
    let nombreEstudiante = document.getElementById('nombreEstudiante').value;
    let asistenciaEstudiante = parseInt(document.getElementById('asistenciaEstudiante').value);
    
    // Calculo del promedio usando las notas ingresadas en el formulario
    let nota1 = parseFloat(document.getElementById('nota1').value);
    let nota2 = parseFloat(document.getElementById('nota2').value);
    let nota3 = document.getElementById('nota3').value ? parseFloat(document.getElementById('nota3').value) : null;

    let promedioEstudiante = calcularPromedio(nota1, nota2, nota3);

    let nuevoEstudiante = {
        nombreEstudiante,
        asistenciaEstudiante,
        condicionAsistencia: calcularCondicion(asistenciaEstudiante, materias[indiceMateria].clasesTotales),
        promedio: promedioEstudiante
    };

    materias[indiceMateria].estudiantes.push(nuevoEstudiante);
    guardarEnStorage();
    formEstudiante.reset();
    mostrarMaterias();
});


// Mostrar materias y estudiantes en el DOM
function mostrarMaterias() {
    resultado.innerHTML = '';
    materias.forEach((materia) => {
        let divMateria = document.createElement('div');
        divMateria.innerHTML = `<h3>Materia: ${materia.nombreMateria} - Profesor: ${materia.nombreProfesor}</h3>`;
        
        let ulEstudiantes = document.createElement('ul');
        materia.estudiantes.forEach(estudiante => {
            let liEstudiante = document.createElement('li');
            liEstudiante.textContent = `${estudiante.nombreEstudiante} - Asistencia: ${estudiante.asistenciaEstudiante} - Condición: ${estudiante.condicionAsistencia} - Promedio: ${estudiante.promedio}`;
            ulEstudiantes.appendChild(liEstudiante);
        });

        divMateria.appendChild(ulEstudiantes);
        resultado.appendChild(divMateria);
    });
}

// Opciones para eliminar los datos ingresados 
// y mostrados en el DOM sobre estudiantes y materia, en caso
// de haber algun error en la carga:

// Eliminar estudiante
function eliminarEstudiante(indiceMateria, indiceEstudiante) {
    materias[indiceMateria].estudiantes.splice(indiceEstudiante, 1); // Eliminar estudiante del array
    guardarEnStorage();
    mostrarMaterias();
}

// Eliminar materia
function eliminarMateria(indiceMateria) {
    materias.splice(indiceMateria, 1); // Eliminar materia del array
    guardarEnStorage();
    mostrarMaterias();
}


function mostrarMaterias() {
    resultado.innerHTML = '';
    materias.forEach((materia, indiceMateria) => {
        let divMateria = document.createElement('div');
        divMateria.innerHTML = `
            <h3>Materia: ${materia.nombreMateria} - Profesor: ${materia.nombreProfesor}
                <button onclick="eliminarMateria(${indiceMateria})">Eliminar</button>
            </h3>
        `;
        
        let ulEstudiantes = document.createElement('ul');
        materia.estudiantes.forEach((estudiante, indiceEstudiante) => {
            let liEstudiante = document.createElement('li');
            liEstudiante.innerHTML = `
                ${estudiante.nombreEstudiante} - Asistencia: ${estudiante.asistenciaEstudiante} - Condición: ${estudiante.condicionAsistencia} - Promedio: ${estudiante.promedio}
                <button onclick="eliminarEstudiante(${indiceMateria}, ${indiceEstudiante})">Eliminar</button>
            `;
            ulEstudiantes.appendChild(liEstudiante);
        });

        divMateria.appendChild(ulEstudiantes);
        resultado.appendChild(divMateria);
    });
}

// Inicializar el simulador al cargar la página
actualizarMateriaSelect();
mostrarMaterias();
