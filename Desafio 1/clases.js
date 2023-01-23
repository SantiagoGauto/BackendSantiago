class Usuario{
    constructor(nombre, apellido, libros, mascotas){
        this.nombre=nombre;
        this.apellido=apellido;
        this.libros=[libros];
        this.mascotas=[mascotas];
    }

    getFullName(){
        console.log(`${this.nombre} ${this.apellido}`)
    }

    addMascota(newMascota){
        this.mascotas.push(newMascota);
    }

    countMascotas(){
        return this.mascotas.length
    }

    addBook(newNombre, newAutor){
        this.libros.push({ nombre: newNombre, autor: newAutor })
    }

    getBookNames(){
        let nombresLibros = this.libros.map(function(libro){
            return libro.nombre;
        });
        return nombresLibros
    }
}

const Yo = new Usuario("Santiago", "Diaz", { nombre: "Don Quijote", autor: "Miguel de Cervantes" }, "Morita");

Yo.getFullName();
Yo.addMascota("Uma");
console.log(Yo.mascotas);
console.log(Yo.countMascotas());
Yo.addBook("La comunidad", "Helene Flood")
console.log(Yo.getBookNames())
